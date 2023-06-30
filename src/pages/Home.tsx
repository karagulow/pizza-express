import React from 'react';
import qs from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
	selectFilter,
	setCategoryId,
	setCurrentPage,
	setFilters
} from '../redux/slices/filterSlice';
import { fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import { sortList } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isSearch = React.useRef(false);
	const isMounded = React.useRef(false);

	const { categoryId, sort, currentPage, searchValue } =
		useSelector(selectFilter);
	const { items, status } = useSelector(selectPizzaData);

	const onClickCategory = (idx: number) => {
		dispatch(setCategoryId(idx));
	};

	const onChangePage = (page: number) => {
		dispatch(setCurrentPage(page));
	};

	const getPizzas = async () => {
		const category = categoryId > 0 ? `category=${categoryId}` : '';
		const sortBy = sort.sortProperty.replace('-', '');
		const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
		const search = searchValue ? `&search=${searchValue}` : '';

		dispatch(
			// @ts-ignore
			fetchPizzas({ category, sortBy, order, search, currentPage })
		);
	};

	React.useEffect(() => {
		if (isMounded.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sortProperty,
				categoryId,
				currentPage
			});

			navigate(`?${queryString}`);
		}
		isMounded.current = true;
	}, [categoryId, sort.sortProperty, currentPage]);

	React.useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1));

			const sort = sortList.find(
				obj => obj.sortProperty === params.sortProperty
			);

			dispatch(setFilters({ ...params, sort }));
			isSearch.current = true;
		}
	}, []);

	React.useEffect(() => {
		// if (!isSearch.current) {
		getPizzas();
		// }

		// isSearch.current = false;
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);

	const pizzas = items.map((obj: any) => (
		<Link key={obj.id} to={`/pizza/${obj.id}`}>
			<PizzaBlock {...obj} />
		</Link>
	));
	const skeletons = [...new Array(8)].map((_, index) => (
		<Skeleton key={index} />
	));

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories value={categoryId} onClickCategory={onClickCategory} />
				<Sort />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			{status === 'error' ? (
				<div className='content__error-info'>
					<h2>Произошла ошибка</h2>
					<p>
						К сожалению, не удалось отобразить пиццы. Попробуйте повторить
						попытку позже
					</p>
				</div>
			) : (
				<div className='content__items'>
					{status === 'loading' ? skeletons : pizzas}
				</div>
			)}

			<Pagination currentPage={currentPage} onChangePage={onChangePage} />
		</div>
	);
};

export default Home;
