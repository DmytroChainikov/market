import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import component_styles from "../styles/component_styles.css";
const CategoryButton = ({ category }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="block category_button shadow-primary-lavender rounded-xl"
    >
      <div className="w-full h-full flex items-center justify-center inner_shadow rounded-xl">
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-2 max-w-[100px] bg-gray-100 "
          title={category.name}
        >
          <category.img sx={{ height: "35px", width: "35px" }} />
          {category.name}
        </div>
      </div>
    </Link>
  );
};
export default CategoryButton;
