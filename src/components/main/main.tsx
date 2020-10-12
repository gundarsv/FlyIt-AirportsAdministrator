import { Container, makeStyles } from "@material-ui/core";
import { Console, error } from "console";
import MaterialTable from "material-table";
import React from "react";
import { withRouter } from "react-router-dom";
import AirportService from "src/services/airport.service";
import { Airport } from "src/types/Airport";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
});

const Main: React.FC = () => {
	const [airports, setAirports] = React.useState<Array<Airport>>([]);
	const classes = useStyles();

	React.useEffect(() => {
		AirportService.getAirports().then(
			response => {
				console.log(response.data);
				setAirports(response.data);
			},
			error => {
				console.log(error);
			},
		);
	}, [setAirports]);

	return (
		<Container className={classes.container} maxWidth="xl">
			<MaterialTable
				title=""
				columns={[
					{ title: "Id", field: "id" },
					{ title: "Iata", field: "iata" },
					{ title: "Airport Name", field: "name" },
				]}
				data={airports}
			/>
		</Container>
	);
};

export default withRouter(Main);
