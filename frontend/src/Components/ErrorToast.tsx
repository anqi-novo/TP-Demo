import { Alert, Snackbar } from "@mui/material";

type Props = {
    open: boolean;
    error: string;
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
};

function ErrorToast({ open, error, handleClose }: Props) {

    return (
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar >
        </>
    );
}

export default ErrorToast;