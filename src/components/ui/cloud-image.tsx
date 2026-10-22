"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";

// Uses Cloudinary's own transformations (format, quality, width) for any
// res.cloudinary.com URL, so Next.js does not re-process those images.
const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = `f_auto,c_limit,w_${width},q_${quality ?? "auto"}`;
  return src.replace("/upload/", `/upload/${params}/`);
};

export function CloudImage(props: ImageProps) {
  const isCloudinary = typeof props.src === "string" && props.src.includes("res.cloudinary.com") && props.src.includes("/upload/");
  return <Image {...props} loader={isCloudinary ? cloudinaryLoader : props.loader} alt={props.alt} />;
}
