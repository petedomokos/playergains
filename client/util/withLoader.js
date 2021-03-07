export const withLoader = (propsToCheck, cb) => component =>{
    const { props } = component;
    const propsFailed= propsToCheck.map(propToCheck => 
        typeof props[propToCheck.path] === propToCheck.propType);
    if(propsFailed.length !== 0){
        cb(propsFailed);
    }
    return(component);
}