const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '4px',
        transition: 'background 0.3s',
    },
    toggleText: {
        marginTop: '10px',
        fontSize: '14px',
    },
    toggleButton: {
        border: 'none',
        background: 'none',
        color: '#007BFF',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
        marginLeft: '5px'
    }
};

export default styles;