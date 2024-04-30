import React, { useState } from "react";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import Button from 'react-bootstrap/Button';
import '../sass/DownProps.scss'; 
import { ButtonGroup } from "react-bootstrap";

interface DownPropsProps {
}

const DownProps: React.FC<DownPropsProps> = () => {
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons(!showAdditionalButtons);
    };

    return (
        <div className="down-props">
            <div className={`fab-container ${showAdditionalButtons ? 'active' : ''}`}>
                <Button className={`fab ${showAdditionalButtons ? 'active' : ''}`} onClick={toggleAdditionalButtons}>
                    {showAdditionalButtons ? <BsFillPauseFill /> : <BsFillPlayFill />}
                </Button>
                <div className={`additional-buttons ${showAdditionalButtons ? 'active' : ''}`}>
                    <Button className="down-props-item">
                        <BsFillPauseFill />
                    </Button>
                    <Button className="down-props-item">
                        <BsFillPlayFill />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DownProps;
