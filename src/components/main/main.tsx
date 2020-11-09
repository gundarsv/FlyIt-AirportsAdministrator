import { Container, Drawer, LinearProgress, Link, makeStyles } from "@material-ui/core";

import { AddAirport } from "components/addAirport";
import AddIcon from "@material-ui/icons/Add";
import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import DeleteIcon from "@material-ui/icons/Delete";
import FileService from "src/services/file.service";
import { MapUploader } from "components/mapUploader.tsx";
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

	const unsavedMaps = [];

	const removeAllUnsavedMaps = () => {
		unsavedMaps.map(map => {
			FileService.deleteFile(map);
		});
		unsavedMaps.splice(0, unsavedMaps.length);
	};

	const removeAllExceptLatestUnsavedMaps = () => {
		unsavedMaps.map((map, index) => {
			if (index !== unsavedMaps.length - 1) {
				FileService.deleteFile(map);
			}
		});
		unsavedMaps.splice(0, unsavedMaps.length);
	};

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
						{ title: "Id", field: "id", editable: "never" },
						{ title: "Iata", field: "iata" },
						{ title: "Airport Name", field: "name" },
						// eslint-disable-next-line react/display-name
						{
							title: "Airport Map",
							field: "mapUrl",
							// eslint-disable-next-line react/display-name
							render: data => <Link href={data.mapUrl}>View map</Link>,
							// eslint-disable-next-line react/display-name
							editComponent: props => {
								const onUploaded = (url: string, fileName: string) => {
									const newAirport = props.rowData;
									newAirport.mapName = fileName;
									newAirport.mapUrl = url;
									unsavedMaps.push(fileName);
									props.onRowDataChange(newAirport);
								};

								return <MapUploader currentMap={props.value} onUploaded={onUploaded} />;
							},
						},
						{ title: "Renting Company Name", field: "rentingCompanyName" },
						{ title: "Renting Company Url", field: "rentingCompanyUrl" },
						{ title: "Renting Company Phone Number", field: "rentingCompanyPhoneNo" },
						{ title: "Taxi Phone Numbers", field: "taxiPhoneNo" },
						{ title: "Emergency Phone Numbers", field: "emergencyPhoneNo" },
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
					editable={{
						onRowUpdateCancelled: () => {
							removeAllUnsavedMaps();
						},
						onRowUpdate: (newData, oldData) => {
							return AirportService.updateAirport(newData).then(
								response => {
									if (response.status === 200) {
										const items = [...airports];

										let item = items.find(airports => airports.id === newData.id);

										const index = items.findIndex(airports => airports.id === newData.id);

										item = newData;
										items[index] = item;
										setAirports(items);

										snackbar.enqueueSnackbar("Airport - " + response.data.id + " was updated", { variant: "success", autoHideDuration: 2000 });

										removeAllExceptLatestUnsavedMaps();
									}
								},
								error => {
									snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
								},
							);
						},
					}}
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
