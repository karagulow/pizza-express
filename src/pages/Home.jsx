import React from 'react';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

const Home = ({ searchValue }) => {
	const [items, setItems] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [categoryId, setCategoryId] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [sortType, setSortType] = React.useState({
		name: 'популярности',
		sortProperty: 'rating'
	});

	React.useEffect(() => {
		setIsLoading(true);

		const category = categoryId > 0 ? `category=${categoryId}` : '';
		const sortBy = sortType.sortProperty.replace('-', '');
		const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
		const search = searchValue ? `&search=${searchValue}` : '';

		fetch(
			`https://648f35e875a96b664444d7d0.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`
		)
			.then(res => {
				return res.json();
			})
			.then(arr => {
				setItems(arr);
				setIsLoading(false);
			});
		window.scrollTo(0, 0);
	}, [categoryId, sortType, searchValue, currentPage]);

	const pizzas = items.map(obj => <PizzaBlock key={obj.id} {...obj} />);
	const skeletons = [...new Array(8)].map((_, index) => (
		<Skeleton key={index} />
	));

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories
					value={categoryId}
					onClickCategory={i => setCategoryId(i)}
				/>
				<Sort value={sortType} onClickSort={i => setSortType(i)} />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			<div className='content__items'>{isLoading ? skeletons : pizzas}</div>
			<Pagination onChangePage={number => setCurrentPage(number)} />
		</div>
	);
};

export default Home;
