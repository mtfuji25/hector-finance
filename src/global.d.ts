declare module "*.svgr" {
  const content: React.MemoExoticComponent<
    (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  >;
  export default content;
}
