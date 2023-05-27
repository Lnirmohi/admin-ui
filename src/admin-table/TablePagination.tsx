import { useEffect, useState } from "react";
import { TablePaginationPropsType } from "./table.types";

import './TablePagination.css';

const TablePagination = ({pageCount, handlePageChange}: TablePaginationPropsType) => {

	const [pageArr, setPageArr] = useState<number[]>([1]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagesToShow, setPageToShow] = useState<number[]>();

	useEffect(() => {
		if(!pageCount) return;

		const pages = [];

		for(let i = 1; i <= pageCount; i++) {
			pages.push(i);
		}

		setPageArr(pages);
	}, [pageCount]);

	useEffect(() => {

		setPageToShow(getPagesToShow(currentPage, pageArr));
	}, [currentPage, pageArr]);
  
	return (
		<div className="pagination-container">
			<div>
				<button disabled={currentPage === 1}>
					&lt;&lt;
				</button>
				<button disabled={currentPage === 1}
					onClick={() => {
						handlePageChange(currentPage - 1);
						setCurrentPage(currentPage - 1);
					}}
				>
					&lt;
				</button>
			</div>

			<button
				className={currentPage === 1 ? 'current-page-bg' : ''}
				onClick={() => {
					handlePageChange(1);
					setCurrentPage(1);
				}}
			>
				1
			</button>

			<MorePageSpan pageSelected={currentPage} totalPages={pageCount} position="front"/>
			
			<div>
			{pagesToShow && pagesToShow
				.filter(page => page !== 1 && page !== pageCount)
				.map((page, index) => (
					<button 
						key={page} 
						className={page === currentPage ? 'current-page-bg' : ''}
						onClick={() => {
							handlePageChange(page);
							setCurrentPage(page);
						}}
					>
						{page}
					</button>
				))
			}
			</div>

			<MorePageSpan pageSelected={currentPage} totalPages={pageCount} position="rear" />

			<button 
				className={currentPage === pageCount ? 'current-page-bg' : ''}
				onClick={() => {
					handlePageChange(pageCount);
					setCurrentPage(pageCount);
				}}
			>
				{pageCount}
			</button>

			<div>
				<button disabled={currentPage === pageCount}
					onClick={() => {
						handlePageChange(currentPage + 1);
						setCurrentPage(currentPage + 1);
					}}
				>
					&gt;
				</button>
				<button disabled={currentPage === pageCount}>&gt;&gt;</button>
			</div>
		</div>
	);
};

export default TablePagination;

type MorePageSpanProps = {
	pageSelected: number;
	totalPages: number;
	position: 'front' | 'rear';
};

function MorePageSpan({pageSelected, totalPages, position}: MorePageSpanProps) {

	if(totalPages <= 7) {
		return null;
	}

	const morePageSpan = <span style={{'paddingTop': '12px'}}>...</span>;

	if(position === 'front' && pageSelected - 3  > 1) {
		return morePageSpan;
	} else if(position === 'rear' && pageSelected + 3 < totalPages) {
		return morePageSpan;
	}
	
	return null;
}

function getPagesToShow(currentPage: number, pageArr: number[]) {

	const firstItem = pageArr[0];
	const lastItem = pageArr[pageArr.length - 1];

	const pagesToShow: number[] = [];

	if((firstItem + currentPage) <= 5) {
		pagesToShow.push(
			...[...pageArr].slice(0, 5), 
			lastItem
		);
	} else if(pageArr.length && (pageArr[pageArr.length - 1] - currentPage) < 4) {
		pagesToShow.push(
			...[firstItem, 
			...pageArr.slice(-5)]
		);
	} else {
		pagesToShow.push(
			...[
				firstItem, 
				currentPage-1, 
				currentPage, 
				currentPage+1, 
				lastItem
			]);
	}

	return pagesToShow;
}