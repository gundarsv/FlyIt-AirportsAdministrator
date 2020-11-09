import { Button, CircularProgress, Link, createStyles, makeStyles } from "@material-ui/core";

import { DropzoneDialog } from "material-ui-dropzone";
import FileService from "src/services/file.service";
import React from "react";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

interface MapUploaderProps {
	currentMap: string | undefined;
	onUploaded: (url: string, fileName: string) => void;
}

const useStyles = makeStyles(theme =>
	createStyles({
		previewChip: {
			minWidth: 160,
			maxWidth: 210,
		},
	}),
);

const MapUploader: React.FC<MapUploaderProps> = ({ currentMap, onUploaded }) => {
	const [isDropzoneDialogOpen, setIsDropzoneDialogOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const classes = useStyles();
	const snackbar = useSnackbar();

	const uploadImage = (file: File) => {
		setIsLoading(true);

		FileService.uploadFile(file).then(
			response => {
				if (response.status === 200) {
					onUploaded(response.data.url, response.data.fileName);
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

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			{currentMap ? <Link href={currentMap}>View map</Link> : null}
			<Button onClick={() => setIsDropzoneDialogOpen(true)}>Upload new map</Button>
			<DropzoneDialog
				open={isDropzoneDialogOpen}
				dialogTitle={"Upload Map"}
				onSave={(files, event) => {
					uploadImage(files[0]);
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
	);
};

export default withRouter(MapUploader);
