import Container from "@mui/material/Container";
import ShopGridStandard from "src/pages/shop/ShopGridStandard";
// ----------------------------------------------------------------------

export default function ProductsView() {
  return (
    <Container>
      <ShopGridStandard hideHeaderAndFooter={true} />
    </Container>
  );
}
