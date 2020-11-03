import { Container, Drawer, LinearProgress, Link, makeStyles } from "@material-ui/core";

import { AddAirport } from "components/addAirport";
import AddIcon from "@material-ui/icons/Add";
import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import DeleteIcon from "@material-ui/icons/Delete";
import MaterialTable from "material-table";
import { News } from "components/news";
import React from "react";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
	drawer: {
		width: "80%",
	},
});

const Main: React.FC = () => {
	const [airports, setAirports] = React.useState<Array<Airport>>([]);
	const [isAddAirportOpen, setIsAddAirportOpen] = React.useState(false);
	const [isNewsOpen, setIsNewsOpen] = React.useState<{ isOpen: boolean; id: number | undefined }>({ isOpen: false, id: undefined });
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

	const handleOpenNews = (airport: Airport) => {
		setIsNewsOpen({ isOpen: true, id: airport.id });
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
						// eslint-disable-next-line react/display-name
						{ title: "Airport Map", field: "mapUrl", render: data => <Link href={data.mapUrl}>View map</Link> },
						{ title: "Renting Company Name", field: "rentingCompanyName" },
						{ title: "Renting Company Url", field: "rentingCompanyUrl" },
						{ title: "Renting Company Phone Number", field: "rentingCompanyPhoneNo" },
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
						{
							// eslint-disable-next-line react/display-name
							icon: () => <ReceiptIcon />,
							tooltip: "Open news",
							onClick: (event, rowData) => {
								handleOpenNews(rowData as Airport);
							},
						},
					]}
				/>
			</Container>
			<Drawer anchor="right" open={isAddAirportOpen} onClose={() => setIsAddAirportOpen(false)}>
				<AddAirport onAirportAdded={onAirportAdded} isOpen={isAddAirportOpen} />
			</Drawer>
			<Drawer classes={{ paper: classes.drawer }} anchor="right" open={isNewsOpen.isOpen} style={{ width: "100%" }} onClose={() => setIsNewsOpen({ isOpen: false, id: undefined })}>
				{isNewsOpen.isOpen ? <News id={isNewsOpen.id} /> : null}
			</Drawer>
		</div>
	);
};

export default withRouter(Main);
