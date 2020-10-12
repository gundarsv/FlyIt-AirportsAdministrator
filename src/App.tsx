import React from "react";
import { SignIn } from "components/signIn";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import AuthService from "./services/auth.service";
import { Main } from "components/main";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { IconButton, Typography } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		title: {
			flexGrow: 1,
		},
	}),
);

const App: React.FC = () => {
	const classes = useStyles();

	function PrivateRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={({ location }) =>
					AuthService.getAuthenticationToken() !== null ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/signIn",
								state: { from: location },
							}}
						/>
					)
				}
			/>
		);
	}

	function PublicRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={({ location }) =>
					AuthService.getAuthenticationToken() === null ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/",
								state: { from: location },
							}}
						/>
					)
				}
			/>
		);
	}

	return (
		<SnackbarProvider maxSnack={3}>
			<Router history={history}>
				<PublicRoute exact path="/signIn">
					<SignIn />
				</PublicRoute>
				<PrivateRoute exact path="/">
					<div className={classes.root}>
						<AppBar position="static">
							<Toolbar>
								<Typography variant="h6" className={classes.title}>
									FlyIt-AirportsAdministrator
								</Typography>
								<IconButton
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={() => {
										AuthService.logout();
										window.location.reload();
									}}
									color="inherit">
									<PowerSettingsNewIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
					</div>
					<Main />
				</PrivateRoute>
			</Router>
		</SnackbarProvider>
	);
};

export default App;
