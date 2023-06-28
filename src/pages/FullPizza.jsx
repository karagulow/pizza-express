import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FullPizza = () => {
	const [pizza, setPizza] = React.useState();
	const { id } = useParams();

	React.useEffect(() => {
		async function fetchPizza() {
			try {
				const { data } = await axios.get(
					'https://648f35e875a96b664444d7d0.mockapi.io/items/' + id
				);
				setPizza(data);
			} catch (error) {
				alert('Ошибка при получении пиццы');
			}
		}

		fetchPizza();
	}, []);

	if (!pizza) {
		return <div className='container'>Загрузка</div>;
	}

	return (
		<div className='container'>
			<img src={pizza.imageUrl} alt='' />
			<h2>{pizza.title}</h2>
			<h4>{pizza.price} ₽</h4>
		</div>
	);
};

export default FullPizza;