"use client";

import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";

export function SiteHeader() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.86)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(14px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 68, gap: 2 }}>
          <Stack
            component={NextLink}
            href="/"
            direction="row"
            spacing={1}
            sx={{ minWidth: 0, alignItems: "center" }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "primary.contrastText",
                bgcolor: "primary.main",
                boxShadow: "0 10px 22px rgba(37,99,235,0.25)",
              }}
            >
              <CatchingPokemonIcon />
            </Box>
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: 900, letterSpacing: 0, whiteSpace: "nowrap" }}
            >
              Pokemon Explorer
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            component={NextLink}
            href="/"
            startIcon={<CatchingPokemonIcon />}
            color="inherit"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Pokemon
          </Button>
          <Button
            component={NextLink}
            href="/about"
            startIcon={<InfoOutlinedIcon />}
            color="inherit"
          >
            About
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
