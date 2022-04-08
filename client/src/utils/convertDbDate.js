const convertDbDate = (value) => {
    value = value.slice(0, 10).split('-')
    return `${value[2]}.${value[1]}.${value[0]}`
};

export default convertDbDate;