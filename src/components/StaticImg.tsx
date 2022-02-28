export const StaticImg: React.VFC<StaticImgProps> = ({ src, alt, ...img }) => {
  return (
    <img
      src={src.src}
      width={src.width}
      height={src.height}
      alt={alt}
      {...img}
    />
  );
};

interface StaticImgProps
  extends Omit<
    React.ComponentPropsWithRef<"img">,
    "width" | "height" | "src" | "alt"
  > {
  src: StaticImageData;
  alt: string;
}
