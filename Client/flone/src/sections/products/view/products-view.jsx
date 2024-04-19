import Container from "@mui/material/Container";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ShopGridStandard from "src/pages/shop/ShopGridStandard";
import { listenToNotifications } from "src/sections/overview/view/app-view";
// ----------------------------------------------------------------------

export default function ProductsView() {
  const dispatch = useDispatch();
  useEffect(() => listenToNotifications(dispatch), []);

  return (
    <Container>
      <ShopGridStandard hideHeaderAndFooter={true} />
    </Container>
  );
}
