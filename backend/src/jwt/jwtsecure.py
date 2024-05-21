from . import JwtConfig

import json
import jwt

from fastapi import HTTPException, Request, status, Response
from base_loader import *

class JwtSecure:
    def __init__(self, config: JwtConfig) -> None:
        """
        Initializes the JwtSecure instance.

        Parameters:
            config (JwtConfig): Configuration settings for JwtSecure.
        """
        self.config = config

    def _g_iat(self) -> float:
        """
        Generates the current time in seconds since the epoch.

        Returns:
            float: Current time in seconds since the epoch.
        """
        return datetime.now(tz=timezone.utc).timestamp()

    def create_access_token(
            self, data: Dict[str, Any]
    ) -> Tuple[str, str]:
        """
        Creates an access token.

        Parameters:
            data (Dict[str, Any]): Data to be encoded into the token.

        Returns:
            str: Access token.
        """
        payload = data.copy()
        iat = self._g_iat()
        
        payload["iat"] = iat
        payload["exp"] = iat + self.config.access_max_age
        payload["trg"] = iat + self.config.trigger_time
        csrf = b64encode(token_urlsafe(16).encode()).decode()
        payload["csrf"] = csrf

        return jwt.encode(
            payload=payload,
            key=self.config.secret_key,
            algorithm=self.config.algorithm,
            headers={
                "alg": self.config.algorithm,
                "typ": "JWT",
                "ttype": "access"
            }
        ), csrf

    def create_refresh_token(
            self, data: Dict[str, Any]
    ) -> Tuple[str, str]:
        """
        Creates a refresh token.

        Parameters:
            data (Dict[str, Any]): Data to be encoded into the token.

        Returns:
            str: Refresh token.
        """
        payload = data.copy()
        iat = self._g_iat()
        
        payload["iat"] = iat
        payload["exp"] = iat + self.config.refresh_max_age
        csrf = b64encode(token_urlsafe(16).encode()).decode()
        payload["csrf"] = csrf
        
        return jwt.encode(
            payload=payload,
            key=self.config.secret_key,
            algorithm=self.config.algorithm,
            headers={
                "alg": self.config.algorithm,
                "typ": "JWT",
                "ttype": "refresh"
            }
        ), csrf

    def get_token(
        self, token: str
    ) -> Dict[str, Dict]:
        """
        Decodes a JWT token and returns its header and payload.

        Parameters:
            token (str): JWT token to decode.

        Returns:
            Dict[str, Dict | bool]: Dictionary containing token header and payload.
        """
        headers: Dict[str, Any] = jwt.get_unverified_header(token)
        payload: Dict[str, Any] = jwt.decode(
            token, self.config.secret_key, algorithms=[self.config.algorithm]
        )

        data = {"headers": headers, "payload": payload}

        if data["headers"]["ttype"] == "access": 
            data["triggered"] = data["payload"]["trg"]

        return data

    def verify(
        self, token: str 
    ) -> Dict[str, Union[int, str]]:
        """
        Verifies the validity of a JWT token.

        Parameters:
            token (str): JWT token to verify.

        Returns:
            Dict[str, Union[int, str]]: Verification result, including status code and error message if any.
        """
        try:
            return {"data": self.get_token(token)}
        except jwt.ExpiredSignatureError:
            return {"code": status.HTTP_401_UNAUTHORIZED, "error": "Unauthorized, jwt token has expired"}
        except jwt.InvalidSignatureError:
            return {"code": status.HTTP_400_BAD_REQUEST, "error": "Invalid signature"}
        except jwt.DecodeError:
            return {"code": status.HTTP_400_BAD_REQUEST, "error": "Invalid jwt"}
        except Exception as e:
            print("[ JwtSecure:verify > ", e)
            return {"code": status.HTTP_500_INTERNAL_SERVER_ERROR, "error": "Something went wrong"}
    
    def _set_cookie(
        self, response: Response, key: str, value: str, 
        max_age: Union[int, timedelta], httponly: bool = True
    ) -> None:
        """
        Sets an HTTP cookie in the response.

        Parameters:
            response (Response): FastAPI response object.
            key (str): Name of the cookie.
            value (str): Value of the cookie.
            max_age (Union[int, timedelta]): Maximum age of the cookie.

        Returns:
            None
        """
        response.set_cookie(
            key=key, value=value, max_age=max_age,
            secure=self.config.secure,
            samesite=self.config.samesite,
            httponly=httponly
        )

    def set_access_cookie(
        self, response: Response, token: str
    ) -> None:
        """
        Sets access tokens and CSRF cookies in the HTTP response.

        Parameters:
            response (Response): FastAPI response object.
            token (str): Access token.

        Returns:
            None
        """
        data = self.verify(token)

        if data.get("data", None):
            data = data.get("data", None)
            self._set_cookie(
                response, self.config.access_cookie_name, 
                token, self.config.access_max_age
            )
            self._set_cookie(
                response, self.config.access_csrf_cookie_name, 
                data["payload"]["csrf"], self.config.access_max_age,
                False
            )
        else:
            response.headers["Content-Type"] = "application/json"
            response.status_code = data["error"]
            response.body = json.dumps({
                "error": data["error"]
            })

    def set_refresh_cookie(
        self, response: Response, token: str
    ) -> None:
        """
        Sets refresh tokens and CSRF cookies in the HTTP response.

        Parameters:
            response (Response): FastAPI response object.
            token (str): Refresh token.

        Returns:
            None
        """
        data = self.verify(token).get("data", None)

        if data:
            self._set_cookie(
                response, self.config.refresh_cookie_name, 
                token, self.config.refresh_max_age
            )
            self._set_cookie(
                response, self.config.refresh_csrf_cookie_name, 
                data["payload"]["csrf"], self.config.refresh_max_age,
                False
            )
        else:
            response.headers["Content-Type"] = "application/json"
            response.status_code = data["code"]
            response.body = json.dumps({
                "error": data["error"]
            })

    def jwt_required(
        self, request: Request, ttype: str
    ) -> Dict:
        """
        Verify the (type)-token is in request and match CSRF cookies with the token payload data.

        Parameters:
            request (Request): FastAPI request object.
            ttype (str: access | refresh): Type of token

        Returns:
            dictionary: {
                payload: {
                    iat: POSIX, 
                    exp: iat + timedelta seconds, 
                    csrf: encoded urlsafe
                    and own payload/s... 
                },
                headers: {
                    ...
                }
                triggered (if access): bool
            }
        """
        _cget = request.cookies.get ; _hget = request.headers.get 
        token = _cget(
            self.config.access_cookie_name
            if ttype == "access" else
            self.config.refresh_cookie_name, None
        )

        if token:
            token_decoded = self.verify(token)

            if token_decoded.get("data", None):
                token_decoded = token_decoded["data"]

                cookie_csrf, header_csrf, payload_csrf = (
                    _cget(
                        self.config.access_csrf_cookie_name
                        if ttype == "access" else
                        self.config.refresh_csrf_cookie_name, None
                    ), _hget(self.config.csrf_header_name, None),
                    token_decoded["payload"]["csrf"]
                )
                
                if cookie_csrf == header_csrf == payload_csrf:
                    if ttype == "access":
                        if token_decoded["triggered"]:
                            self.set_access_cookie(
                                Response(), 
                                self.create_access_token({
                                    "id": token_decoded["payload"]["id"]
                                })
                            )
                            print("[TRIGGER > new token")
                    return token_decoded
                else:
                    raise HTTPException(
                        status.HTTP_400_BAD_REQUEST, "CSRF tokens aren't match"
                    )
            else:
                raise HTTPException(
                    token_decoded["code"], token_decoded["error"]
                )
        else:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, f"{ttype.capitalize()} token is required but not provided"
            )
        
    def access_required(self, request: Request) -> Dict: return self.jwt_required(request, "access")
    def refresh_required(self, request: Request) -> Dict: return self.jwt_required(request, "refresh")

    def dismantle(self, response: Response) -> None:
        response.delete_cookie(self.config.access_cookie_name)
        response.delete_cookie(self.config.access_csrf_cookie_name)

        response.delete_cookie(self.config.refresh_cookie_name)
        response.delete_cookie(self.config.refresh_csrf_cookie_name)