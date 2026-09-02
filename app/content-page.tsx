import {Site} from './site';
export default function ContentPage({eyebrow,title,children}:{eyebrow:string,title:string,children:React.ReactNode}){return <Site><section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div></section><section className="section"><div className="container">{children}</div></section></Site>}
