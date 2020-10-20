import { Button, CircularProgress, List, ListItem, ListItemIcon, TextField, makeStyles } from "@material-ui/core";

import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
	list: {
		width: 450,
	},
});

export interface AddAiportProps {
	onAirportAdded: (airport: Airport) => void;
}

const AddAirport: React.FC<AddAiportProps> = ({ onAirportAdded }) => {
	const classes = useStyles();
	const snackbar = useSnackbar();

	const [isLoading, setIsLoading] = React.useState(false);
	const [iata, setIata] = React.useState("");
	const [iataError, setIataError] = React.useState("");
	const [airportName, setAirportName] = React.useState("");
	const [airportNameError, setAirportNameError] = React.useState("");

	const handleAddAirport = () => {
		if (isError()) {
			return;
		}

		setIsLoading(true);
		AirportService.addAirport(iata, airportName).then(
			response => {
				if (response.status === 201) {
					setIsLoading(false);
					onAirportAdded(response.data);
					snackbar.enqueueSnackbar("Airport - " + response.data.iata + " was added", { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				setIsLoading(false);
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const isError = (): boolean => {
		!iata ? setIataError("Add Iata") : setIataError("");
		!airportName ? setAirportNameError("Add Airport name") : setAirportNameError("");

		return !iata || !airportName;
	};

	return (
		<div className={classes.list} role="presentation">
			{isLoading ? (
				<div style={{ textAlign: "center", marginTop: 80 }}>
					<CircularProgress />
				</div>
			) : (
				<div>
					<List>
						<ListItem>
							<TextField
								error={iataError !== ""}
								helperText={iataError !== "" ? iataError : null}
								value={iata}
								onChange={event => setIata(event.target.value)}
								fullWidth
								label="Iata"
								variant="outlined"
							/>
						</ListItem>
						<ListItem>
							<TextField
								error={airportNameError !== ""}
								helperText={airportNameError !== "" ? airportNameError : null}
								value={airportName}
								onChange={event => setAirportName(event.target.value)}
								fullWidth
								label="Airport Name"
								variant="outlined"
							/>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem>
							<Button onClick={() => handleAddAirport()} fullWidth>
								Add Airport
							</Button>
						</ListItem>
					</List>
				</div>
			)}
		</div>
	);
};

export default withRouter(AddAirport);
