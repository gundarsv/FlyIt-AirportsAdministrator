import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AuthService from "../../services/auth.service";
import { useHistory } from "react-router";
import { withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	wrapper: {
		margin: theme.spacing(1),
		position: "relative",
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -8,
		marginLeft: -12,
	},
}));

const SignIn: React.FC = () => {
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const onLogin = () => {
		if (!email || !password) {
			return;
		}

		setIsLoading(true);

		AuthService.singIn(email, password).then(
			response => {
				setIsLoading(false);
				history.push("/");
			},
			error => {
				enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
				setIsLoading(false);
			},
		);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<SupervisorAccountRoundedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					FlyIt-AirportsAdministrator
				</Typography>
				<TextField
					disabled={isLoading}
					value={email}
					onChange={e => setEmail(e.target.value)}
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
				/>
				<TextField
					disabled={isLoading}
					value={password}
					onChange={e => setPassword(e.target.value)}
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
				/>
				<div className={classes.wrapper}>
					<Button disabled={isLoading} onClick={() => onLogin()} type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
						Sign In
					</Button>
					{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
				</div>
			</div>
		</Container>
	);
};

export default withRouter(SignIn);
