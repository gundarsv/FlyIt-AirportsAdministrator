import { Container, Drawer, LinearProgress, makeStyles } from "@material-ui/core";

import { AddAirport } from "components/addAirport";
import AddIcon from "@material-ui/icons/Add";
import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import DeleteIcon from "@material-ui/icons/Delete";
import MaterialTable from "material-table";
import React from "react";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
});

const Main: React.FC = () => {
	const [airports, setAirports] = React.useState<Array<Airport>>([]);
	const [isAddAirportOpen, setIsAddAirportOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const classes = useStyles();
	const snackbar = useSnackbar();

	React.useEffect(() => {
		AirportService.getAirports().then(
			response => {
				setAirports(response.data);
				setIsLoading(false);
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
				setIsLoading(false);
			},
		);
	}, [setAirports, setIsLoading, snackbar]);

	const onAirportAdded = (airport: Airport) => {
		setIsAddAirportOpen(false);
		setIsLoading(true);
		setAirports([...airports, airport]);
		setIsLoading(false);
	};

	const handleRemoveAirport = (airport: Airport) => {
		AirportService.deleteAirport(airport.id).then(
			response => {
				if (response.status === 200) {
					setAirports(airports.filter(a => a.id !== airport.id));
					snackbar.enqueueSnackbar("Airport - " + airport.iata + " was removed", { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	if (isLoading) {
		return <LinearProgress />;
	}

	return (
		<div>
			<Container className={classes.container} maxWidth="xl">
				<MaterialTable
					style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'" }}
					columns={[
						{ title: "Id", field: "id" },
						{ title: "Iata", field: "iata" },
						{ title: "Airport Name", field: "name" },
					]}
					options={{ showTitle: false, sorting: true, paging: false, minBodyHeight: 750, maxBodyHeight: 750, actionsColumnIndex: -1 }}
					data={airports}
					actions={[
						{
							// eslint-disable-next-line react/display-name
							icon: () => <DeleteIcon />,
							tooltip: "Remove Airport",
							onClick: (event, rowData) => {
								handleRemoveAirport(rowData as Airport);
							},
						},
						{
							// eslint-disable-next-line react/display-name
							icon: () => <AddIcon />,
							tooltip: "Add Airport",
							isFreeAction: true,
							onClick: () => {
								setIsAddAirportOpen(true);
							},
						},
					]}
				/>
			</Container>
			<Drawer anchor="right" open={isAddAirportOpen} onClose={() => setIsAddAirportOpen(false)}>
				<AddAirport onAirportAdded={onAirportAdded} />
			</Drawer>
		</div>
	);
};

export default withRouter(Main);
