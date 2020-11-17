import { Button, ButtonGroup, CircularProgress, Link, List, ListItem, ListItemIcon, TextField, Typography, makeStyles } from "@material-ui/core";

import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import Divider from "@material-ui/core/Divider";
import { DropzoneDialog } from "material-ui-dropzone";
import FileService from "src/services/file.service";
import { FormHelperText } from "@material-ui/core";
import React from "react";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
	list: {
		width: 450,
	},
	previewChip: {
		minWidth: 160,
		maxWidth: 210,
	},
});

export interface AddAiportProps {
	onAirportAdded: (airport: Airport) => void;
	isOpen: boolean;
}

const AddAirport: React.FC<AddAiportProps> = ({ onAirportAdded, isOpen }) => {
	const classes = useStyles();
	const snackbar = useSnackbar();
	const [isDropzoneDialogOpen, setIsDropzoneDialogOpen] = React.useState(false);
	const [isMapAdded, setIsMapAdded] = React.useState(false);
	const [unsavedFiles, setUnsavedFiles] = React.useState([]);

	const [isLoading, setIsLoading] = React.useState(false);
	const [iata, setIata] = React.useState("");
	const [iataError, setIataError] = React.useState("");
	const [airportName, setAirportName] = React.useState("");
	const [airportNameError, setAirportNameError] = React.useState("");
	const [mapUrl, setMapUrl] = React.useState("");
	const [mapName, setMapName] = React.useState("");
	const [mapError, setMapError] = React.useState("");
	const [rentingCompanyUrl, setRentingCompanyUrl] = React.useState("");
	const [rentingCompanyUrlError, setRentingCompanyUrlError] = React.useState("");
	const [rentingCompanyPhoneNo, setRentingCompanyPhoneNo] = React.useState("");
	const [rentingCompanyPhoneNoError, setRentingCompanyPhoneNoError] = React.useState("");
	const [rentingCompanyName, setRentingCompanyName] = React.useState("");
	const [rentingCompanyNameError, setRentingCompanyNameError] = React.useState("");
	const [taxiPhoneNo, setTaxiPhoneNo] = React.useState("");
	const [taxiPhoneNoError, setTaxiPhoneNoError] = React.useState("");
	const [emergencyPhoneNo, setEmergencyPhoneNo] = React.useState("");
	const [emergencyPhoneNoError, setEmergencyPhoneNoError] = React.useState("");
	const [icao, setIcao] = React.useState("");
	const [icaoError, setIcaoError] = React.useState("");

	const handleAddAirport = () => {
		if (isError()) {
			return;
		}

		setIsLoading(true);
		AirportService.addAirport(iata, airportName, mapUrl, mapName, rentingCompanyName, rentingCompanyUrl, rentingCompanyPhoneNo, taxiPhoneNo, emergencyPhoneNo, icao).then(
			response => {
				if (response.status === 201) {
					setIsLoading(false);
					setUnsavedFiles([]);
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

	React.useEffect(() => {
		if (!isOpen) {
			if (unsavedFiles.length > 0) {
				FileService.deleteFile(unsavedFiles.pop());
				setUnsavedFiles([]);
			}
		}
	}, [isOpen, unsavedFiles, setUnsavedFiles]);

	const removeMap = () => {
		setIsLoading(true);

		FileService.deleteFile(mapName).then(
			response => {
				if (response.status === 200) {
					setIsMapAdded(false);
					setMapName("");
					setMapUrl("");
					setUnsavedFiles([]);
					snackbar.enqueueSnackbar("Map was uploaded", { variant: "success", autoHideDuration: 2000 });
				}
				setIsLoading(false);
			},
			error => {
				setIsLoading(false);
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const uploadMap = (file: File) => {
		setIsLoading(true);

		FileService.uploadFile(file).then(
			response => {
				if (response.status === 200) {
					setMapUrl(response.data.url);
					setMapName(response.data.fileName);
					setMapError("");
					setIsMapAdded(true);
					setUnsavedFiles([...unsavedFiles, response.data.fileName]);
					snackbar.enqueueSnackbar("Map was uploaded", { variant: "success", autoHideDuration: 2000 });
				}
				setIsLoading(false);
			},
			error => {
				setIsLoading(false);
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const renderAddMap = () => {
		return (
			<ListItem style={mapError !== "" ? { display: "flow-root" } : {}}>
				<Button
					variant={mapError !== "" ? "outlined" : "text"}
					aria-describedby="map-helper-text"
					style={mapError !== "" ? { color: "red", border: "1px solid red" } : {}}
					onClick={() => setIsDropzoneDialogOpen(true)}
					fullWidth>
					Add Map
				</Button>
				{mapError !== "" ? (
					<FormHelperText style={{ marginLeft: 14, marginRight: 14 }} id="map-helper-text" disabled={mapError === ""} error={mapError !== ""}>
						{mapError}
					</FormHelperText>
				) : null}
			</ListItem>
		);
	};

	const renderRemoveMap = () => {
		return (
			<ListItem>
				<ButtonGroup fullWidth variant="contained" color="primary">
					<Button href={mapUrl}>View Map</Button>
					<Button onClick={() => removeMap()}>Remove Map</Button>
				</ButtonGroup>
			</ListItem>
		);
	};

	const isError = (): boolean => {
		!iata ? setIataError("Add Iata") : setIataError("");
		!airportName ? setAirportNameError("Add Airport name") : setAirportNameError("");
		!mapName || !mapUrl ? setMapError("Upload Airport map") : setMapError("");
		!rentingCompanyName ? setRentingCompanyNameError("Add renting company name") : setRentingCompanyNameError("");
		!rentingCompanyUrl ? setRentingCompanyUrlError("Add renting company url") : setRentingCompanyUrlError("");
		!rentingCompanyPhoneNo ? setRentingCompanyPhoneNoError("Add renting company phone number") : setRentingCompanyPhoneNoError("");
		!taxiPhoneNo ? setTaxiPhoneNoError("Add taxi phone number") : setTaxiPhoneNoError("");
		!emergencyPhoneNo ? setEmergencyPhoneNoError("Add emergency phone number") : setEmergencyPhoneNoError("");
		!icao ? setIcaoError("Add Icao") : setIcaoError("");

		return !iata || !airportName || !mapUrl || !mapName || !rentingCompanyName || !rentingCompanyUrl || !rentingCompanyPhoneNo || !emergencyPhoneNo || !taxiPhoneNo || !icao;
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
								error={icaoError !== ""}
								helperText={icaoError !== "" ? icaoError : null}
								value={icao}
								onChange={event => setIcao(event.target.value)}
								fullWidth
								label="Icao"
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
						<ListItem>
							<TextField
								type="text"
								error={rentingCompanyNameError !== ""}
								helperText={rentingCompanyNameError !== "" ? rentingCompanyNameError : null}
								value={rentingCompanyName}
								onChange={event => setRentingCompanyName(event.target.value)}
								fullWidth
								label="Renting company name"
								variant="outlined"
							/>
						</ListItem>
						<ListItem>
							<TextField
								type="url"
								error={rentingCompanyUrlError !== ""}
								helperText={rentingCompanyUrlError !== "" ? rentingCompanyUrlError : null}
								value={rentingCompanyUrl}
								onChange={event => setRentingCompanyUrl(event.target.value)}
								fullWidth
								label="Renting company url"
								variant="outlined"
							/>
						</ListItem>
						<ListItem>
							<TextField
								type="tel"
								error={rentingCompanyPhoneNoError !== ""}
								helperText={rentingCompanyPhoneNoError !== "" ? rentingCompanyPhoneNoError : null}
								value={rentingCompanyPhoneNo}
								onChange={event => setRentingCompanyPhoneNo(event.target.value)}
								fullWidth
								label="Renting company phone number"
								variant="outlined"
							/>
						</ListItem>
						<ListItem>
							<TextField
								type="tel"
								error={emergencyPhoneNoError !== ""}
								helperText={taxiPhoneNoError !== "" ? taxiPhoneNoError : null}
								value={taxiPhoneNo}
								onChange={event => setTaxiPhoneNo(event.target.value)}
								fullWidth
								label="Taxi Phone Number"
								variant="outlined"
							/>
						</ListItem>
						<ListItem>
							<TextField
								type="tel"
								error={emergencyPhoneNoError !== ""}
								helperText={emergencyPhoneNoError !== "" ? emergencyPhoneNoError : null}
								value={emergencyPhoneNo}
								onChange={event => setEmergencyPhoneNo(event.target.value)}
								fullWidth
								label="Emergency Phone Number"
								variant="outlined"
							/>
						</ListItem>
						{isMapAdded ? renderRemoveMap() : renderAddMap()}
					</List>
					<Divider />
					<List>
						<ListItem>
							<Button onClick={() => handleAddAirport()} fullWidth>
								Add Airport
							</Button>
						</ListItem>
					</List>

					<DropzoneDialog
						open={isDropzoneDialogOpen}
						dialogTitle={"Upload Airport Map"}
						onSave={(files, event) => {
							uploadMap(files[0]);
							setIsDropzoneDialogOpen(false);
						}}
						acceptedFiles={["application/pdf"]}
						dropzoneText={"Drag and drop an airport map file here or click"}
						showPreviews={true}
						filesLimit={1}
						maxFileSize={5000000}
						showPreviewsInDropzone={false}
						useChipsForPreview
						previewGridProps={{ container: { spacing: 1, direction: "row" } }}
						previewChipProps={{ classes: { root: classes.previewChip } }}
						previewText="Selected files"
						onClose={() => setIsDropzoneDialogOpen(false)}
					/>
				</div>
			)}
		</div>
	);
};

export default withRouter(AddAirport);
