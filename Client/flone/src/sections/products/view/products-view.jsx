import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ShopGridStandard from "src/pages/shop/ShopGridStandard";
// ----------------------------------------------------------------------

export default function ProductsView() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>
      <ShopGridStandard hideHeaderAndFooter={true} />
    </Container>
  );
}
