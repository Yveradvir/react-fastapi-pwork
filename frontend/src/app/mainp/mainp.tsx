import Layout from "@modules/components/layout"

const MainP: React.FC = () => {
    return (
        <Layout>
            <h1>{import.meta.env.VITE_A}</h1>
        </Layout>
    );
}

export default MainP;