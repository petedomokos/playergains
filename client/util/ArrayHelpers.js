/**
*
**/
//indexOf returns the first index where the value occurs.
//if this is before index, then it be false and value will drop out
export const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

export const onlyUniqueByProperty = (key, array) => element =>
	array.find(other => other[key] === element[key])

export const onlyUniqueByProperties = (keys, array) => element => true //todo
	//array.find(other => other[key] === element[key])

export const filterUniqueByProperty = (key, array) =>{
	const uniqueValues = array
		.map(elem => elem[key])
		.filter(onlyUnique)
	return uniqueValues
		.map(val => array.find(elem => elem[key] === val))
}

export const filterUniqueById = items => filterUniqueByProperty('_id', items)

export const elementsMatching = (elem1, elem2, keys) =>{
	let matching = true
	keys.forEach(key => {
		if(elem1[key] !== elem2[key])
			matching = false
	})
	return matching
}

export const filterUniqueByProperties= (keys, array) =>{
	return array.filter((elem,i) =>{
		const previousElems = array.slice(0,i)
		if(previousElems.find(el => elementsMatching(el, elem, keys)))
			return false
		return true
	})
}


export const findById = (id, items) =>{
	return items.find(item => item._id === id)
}
