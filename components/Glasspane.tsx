import clsx from "clsx";

const GlassPane = ({children, className}: any) => {
    return <div className={clsx('glass rounded-2xl', className)}>
        {children}
    </div>
}

export default GlassPane;