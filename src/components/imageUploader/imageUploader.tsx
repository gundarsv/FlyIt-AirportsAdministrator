import { Button, CircularProgress, createStyles, makeStyles } from "@material-ui/core";

import { DropzoneDialog } from "material-ui-dropzone";
import ImageService from "src/services/image.service";
import React from "react";
import { withRouter } from "react-router-dom";

interface ImageUploaderProps {
	currentImage: string | undefined;
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

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onUploaded }) => {
	const [isDropzoneDialogOpen, setIsDropzoneDialogOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const classes = useStyles();

	const uploadImage = (file: File) => {
		setIsLoading(true);

		ImageService.uploadImage(file, file.name).then(
			response => {
				if (response.status === 200) {
					onUploaded(response.data, file.name);
				}
				setIsLoading(false);
			},
			error => {
				console.log(error);
				setIsLoading(false);
			},
		);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			{currentImage ? <img style={{ width: 200 }} src={currentImage} /> : null}
			<Button onClick={() => setIsDropzoneDialogOpen(true)}>Upload new image</Button>
			<DropzoneDialog
				open={isDropzoneDialogOpen}
				dialogTitle={"Upload image"}
				onSave={(files, event) => {
					uploadImage(files[0]);
					setIsDropzoneDialogOpen(false);
				}}
				acceptedFiles={["image/*"]}
				dropzoneText={"Drag and drop an image here or click"}
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

export default withRouter(ImageUploader);
