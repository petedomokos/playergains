import React, { useEffect, useState } from 'react';
/*export const withLoader = (propsToCheck, cb) => component =>{
    console.log('Hi from hoc')
    const { props } = component;
    const propsFailed= propsToCheck.map(propToCheck => 
        typeof props[propToCheck.path] === propToCheck.propType);
    if(propsFailed.length !== 0){
        cb(propsFailed);
    }
    return(component);
}*/
/*
-can get a extraLoadArg prop, which is passed back to the onLoad function
 - must receive an onLoad function in props
 - whileNotLoaded option allows more granular control over what is displayed whilst loading props 
   (a) alwaysRender - passes responsibility for handling non-loaded props to the wrapped component
   (b) LoadingPlaceholder - renders a custom placeholder while loading
   (b) ErrorPlaceholder - renders a custom placeholder if error
*/

//need to rethink the load thing - maybe should be settings or loadInfoObject,
export function withLoader(ComponentWhenLoaded, propsToCheck=[], whileNotLoaded={}){
    //when loader is called, eg by UserContainer, it is passed the props
    const loader = props => {
        //note: we dont control the loading state here - it is contained in store as other components may also load this resource
        const {extraLoadArg, onLoad, loading, loadingError, ...passedThroughProps} = props;

        var propsLoaded = false;
        if(!loading && onLoad){
            //need to check props have all been loaded ( 0 and false are ok) every time in case page refreshed etc
            const propsToLoad = propsToCheck.filter(propToCheck =>
                props[propsToCheck] !== 0 && props[propsToCheck] !== false && !props[propToCheck])
            console.log('Loader props', props)
            console.log('Loader propsTocheck', propsToCheck)
            console.log('Loader propsToload', propsToLoad)
            if(propsToLoad.length !== 0){
                onLoad(propsToLoad, extraLoadArg);
            }else{
                propsLoaded = true;
            }
        }
        if(propsLoaded){
            //doesnt need to recieve props about load status
            return <ComponentWhenLoaded {...passedThroughProps} />;
        }
        //3 options while props not loaded - load anyway, load custom placeholder, load default placeholder
        const { alwaysRender, LoadingPlaceholder, ErrorPlaceholder } = whileNotLoaded;
        if(alwaysRender){
            //needs props about load status so it can handle
            return <ComponentWhenLoaded {...passedThroughProps} loading={loading} error={error}/>;
        }
        if(loading){
            return LoadingPlaceholder || <div>Loading...</div>;
        }
        if(loadingError){
            return ErrorPlaceholder || <div>Server Error</div> 
        }   
        return null;    
    }
    return loader;

}

/*
 useEffect(() =>{
            if(!loading && onLoad){
                //need to check props have all been loaded ( 0 and false are ok)
                const propsToLoad = propsToCheck.filter(propToCheck =>
                    props[propsToCheck] !== 0 && props[propsToCheck] !== false && !props[propToCheck])
                console.log('Loader props', props)
                console.log('Loader propsTocheck', propsToCheck)
                console.log('Loader propsToload', propsToLoad)
                if(propsToLoad.length !== 0){
                    onLoad(userId, propsToLoad);
                }else{
                    setPropsLoaded(true);
                }
            }
        })
        */
