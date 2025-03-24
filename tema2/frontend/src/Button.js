
const Button = ({name, id, func}) => {
    return (
        <button onClick={func}>{name}</button>
    )
}

export default Button