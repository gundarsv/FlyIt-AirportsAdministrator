import React from "react";
import { News } from "src/types/News";
import { withRouter } from "react-router-dom";
import NewsService from "src/services/news.service";
import { useSnackbar } from "notistack";
import { Container, LinearProgress, makeStyles } from "@material-ui/core";
import MaterialTable from "material-table";
import { ImageUploader } from "components/imageUploader";
import ImageService from "src/services/image.service";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
});

interface NewsProps {
	id: number | undefined;
}

const News: React.FC<NewsProps> = ({ id }) => {
	const snackbar = useSnackbar();
	const classes = useStyles();

	const [isLoading, setIsLoading] = React.useState(true);
	const [news, setNews] = React.useState<News[]>([]);
	const unsavedImages = [];

	React.useEffect(() => {
		NewsService.getNewsByAirportId(id).then(
			response => {
				if (response.status === 200) {
					setNews(response.data);
				}
				setIsLoading(false);
			},
			error => {
				setIsLoading(false);
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	}, [setNews, setIsLoading, id, snackbar]);

	if (isLoading) {
		return <LinearProgress />;
	}

	return (
		<Container className={classes.container} maxWidth="xl">
			<MaterialTable
				style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'" }}
				columns={[
					{ title: "Id", field: "id", editable: "never" },
					{ title: "Title", field: "title" },
					{ title: "Body", field: "body" },
					{
						title: "Image",
						field: "imageurl",
						// eslint-disable-next-line react/display-name
						render: rowData => <img style={{ width: 200 }} src={rowData.imageurl}></img>,
						// eslint-disable-next-line react/display-name
						editComponent: props => {
							const onUploaded = (url: string, fileName: string) => {
								const newNews = props.rowData;
								newNews.imagename = fileName;
								newNews.imageurl = url;
								unsavedImages.push(fileName);
								props.onRowDataChange(newNews);
							};

							return <ImageUploader currentImage={props.value} onUploaded={onUploaded} />;
						},
					},
				]}
				options={{ showTitle: false, sorting: true, paging: false, minBodyHeight: 750, maxBodyHeight: 750, actionsColumnIndex: -1 }}
				data={news}
				editable={{
					onRowUpdateCancelled: () => {
						unsavedImages.map(image => {
							ImageService.deleteImage(image);
						});
						unsavedImages.splice(0, unsavedImages.length);
					},
					onRowAdd: newData => {
						return NewsService.addNews(newData, id).then(
							response => {
								if (response.status === 201 || response.status === 200) {
									setNews([...news, response.data]);
									snackbar.enqueueSnackbar("News - " + response.data.id + " was added", { variant: "success", autoHideDuration: 2000 });

									unsavedImages.map((image, index) => {
										if (index !== unsavedImages.length - 1) {
											ImageService.deleteImage(image);
										}
									});
									unsavedImages.splice(0, unsavedImages.length);
								}
							},
							error => {
								snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
							},
						);
					},
					onRowUpdate: (newData, oldData) => {
						return NewsService.updateNews(newData).then(
							response => {
								if (response.status === 200) {
									const items = [...news];

									let item = items.find(news => news.id === newData.id);

									const index = items.findIndex(news => news.id === newData.id);

									item = newData;
									items[index] = item;
									setNews(items);

									unsavedImages.map((image, index) => {
										if (index !== unsavedImages.length - 1) {
											ImageService.deleteImage(image);
										}
									});
									unsavedImages.splice(0, unsavedImages.length);
								}
							},
							error => {
								snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
							},
						);
					},
					onRowDelete: oldData => {
						return NewsService.deleteNews(oldData.id).then(
							response => {
								if (response.status === 200) {
									setNews(news.filter(n => n.id !== oldData.id));
									snackbar.enqueueSnackbar("News - " + oldData.id + " was removed", { variant: "success", autoHideDuration: 2000 });
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
	);
};

export default withRouter(News);
