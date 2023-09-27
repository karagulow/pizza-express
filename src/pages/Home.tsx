import React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	selectFilter,
	setCategoryId,
	setCurrentPage,
	setFilters
} from '../redux/slices/filterSlice';
import {
	fetchPizzas,
	SearchPizzaParams,
	selectPizzaData
} from '../redux/slices/pizzaSlice';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import { sortList } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
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
			fetchPizzas({
				sortBy,
				order,
				category,
				search,
				currentPage: String(currentPage)
			})
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
			const params = qs.parse(
				window.location.search.substring(1)
			) as unknown as SearchPizzaParams;

			const sort = sortList.find(obj => obj.sortProperty === params.sortBy);

			dispatch(
				setFilters({
					searchValue: params.search,
					categoryId: Number(params.category),
					currentPage: Number(params.currentPage),
					sort: sort || sortList[0]
				})
			);
			isSearch.current = true;
		}

		if (!window.location.search) {
			dispatch(fetchPizzas({} as SearchPizzaParams));
		}
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);

	React.useEffect(() => {
		getPizzas();
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);

	const pizzas = items.map((obj: any) => <PizzaBlock {...obj} />);
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
