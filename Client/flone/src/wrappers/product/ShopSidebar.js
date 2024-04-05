import PropTypes from "prop-types";
import clsx from "clsx";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import api, { getData } from "../../utils/api";
import { useEffect, useState } from "react";

const ShopSidebar = ({ products, getSortParams, sideSpaceClass, onSearch }) => {
  const [uniqueCategories,setUniqueCategories]=useState([])

  useEffect(()=>{
    getData(api.categories)
    .then((categories) => {
      setUniqueCategories(categories) 
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
  },[])

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch onSearch={onSearch} />

      {/* filter by categories */}
      <ShopCategories
        categories={uniqueCategories}
        getSortParams={getSortParams}
      />
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
