import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    useTheme,
    Typography,
} from "@mui/material"
import useCRUD from "../../hook/useCRUD"
import { useEffect } from "react"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import { MEDIA_URL } from "../../config"
import { Link } from "react-router-dom"

interface Category {
    id: number
    name: string
    description: string
    icon: string
}

const ExploreCategories = () => {
    const theme = useTheme()

    const { dataCRUD, fetchData } = useCRUD<Category>(
        [],
        "/server/category/"
    )

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Box
                sx={{
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.palette.background.default,
                }}
            >
                Explore
            </Box>
            <List
                sx={{
                    py: 0,
                }}
            >
                {dataCRUD.map((item) => (
                    <ListItem
                        key={item.id}
                        disablePadding
                        sx={{
                            display: "block"
                        }}
                        dense={true}
                    >
                        <Link
                            to={`/explore/${item.name}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <ListItemAvatar
                                        sx={{
                                            minWidth: "0px",
                                        }}
                                    >
                                        <img
                                            src={`${MEDIA_URL}${item.icon}`}
                                            style={{
                                                width: "25px",
                                                height: "25px",
                                                display: "block",
                                                margin: "auto",
                                            }}
                                            alt="Category Icon"
                                        />
                                    </ListItemAvatar>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body1"
                                            textAlign="start"
                                            paddingLeft={1}
                                        >
                                            {item.name}
                                        </Typography>
                                    }
                                >

                                </ListItemText>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default ExploreCategories