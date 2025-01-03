import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Link,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import MenuIcon from "@mui/icons-material/Menu"
import { useEffect, useState } from "react"
import ExploreCategories from "../../components/SecondaryDraw/ExploreCategories"

const PrimaryAppBar = () => {
    const [sideMenu, setSideMenu] = useState(false)
    const theme = useTheme()

    const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"))

    useEffect(() => {
        if (isSmallScreen && sideMenu) {
            setSideMenu(false)
        }
    }, [isSmallScreen])

    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
            ) {
                return
            }
            setSideMenu(open)
        }

    const list = () => (
        <Box
            sx={{
                paddingTop: `${theme.primaryAppBar.height}px`,
                minWidth: 200
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <ExploreCategories />
        </Box >
    )

    return (
        <AppBar sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`
        }}>
            <Toolbar
                variant="dense"
                sx={{
                    height: theme.primaryAppBar.height
                }}
            >

                <Box sx={{
                    display: { xs: "block", sm: "none" }
                }}
                >
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>

                <Link href='/' underline="none">
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            display: { fontWeight: 700, letterSpacing: "-0.5px" }
                        }}
                    >
                        DJCHAT
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar >
    )
}

export default PrimaryAppBar