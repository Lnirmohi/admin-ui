import { DetailedHTMLProps, HTMLProps, ReactNode, useEffect, useState } from "react";
import { TablePaginationPropsType } from "./table.types";

interface PageNumberProps extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children: ReactNode;
}

const PageNumberButton = ({children, className, ...props}: PageNumberProps) => {
	return (
		<button 
			className={`
				self-start text-blue-500 border-transparent border-2 hover:rounded
				font-semibold text-xl py-1 px-2 bg-transparent hover:bg-blue-500 hover:text-white
				${className}
			`}
			{...props}
		>
			{children}
		</button>
	);
};


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
		setCurrentPage(prev => (
			prev === pageCount + 1 
			? pageCount
			: prev
		));
	}, [pageCount]);

	useEffect(() => {

		setPageToShow(getPagesToShow(currentPage, pageArr));
	}, [currentPage, pageArr]);
  
	return (
		<div className="pagination-container flex flex-row self-center gap-11">
			<div>
				<PageNumberButton disabled={currentPage === 1}>
					&lt;&lt;
				</PageNumberButton>
				<PageNumberButton disabled={currentPage === 1}
					onClick={() => {
						handlePageChange(currentPage - 1);
						setCurrentPage(currentPage - 1);
					}}
				>
					&lt;
				</PageNumberButton>
			</div>

			<PageNumberButton
				className={currentPage === 1 ? 'current-page-bg' : ''}
				onClick={() => {
					handlePageChange(1);
					setCurrentPage(1);
				}}
			>
				1
			</PageNumberButton>

			<MorePageSpan pageSelected={currentPage} totalPages={pageCount} position="front"/>
			
			<div>
			{pagesToShow && pagesToShow
				.filter(page => page !== 1 && page !== pageCount)
				.map((page, index) => (
					<PageNumberButton 
						key={page} 
						className={page === currentPage ? 'current-page-bg' : ''}
						onClick={() => {
							handlePageChange(page);
							setCurrentPage(page);
						}}
					>
						{page}
					</PageNumberButton>
				))
			}
			</div>

			<MorePageSpan pageSelected={currentPage} totalPages={pageCount} position="rear" />

			{pageCount !== 1 && ( 
				<div className="flex flex-row gap-3">
					<PageNumberButton 
						className={currentPage === pageCount ? 'current-page-bg' : ''}
						onClick={() => {
							handlePageChange(pageCount);
							setCurrentPage(pageCount);
						}}
					>
						{pageCount}
					</PageNumberButton>
				</div>
			)}

			<div>
				<PageNumberButton disabled={currentPage === pageCount}
					onClick={() => {
						handlePageChange(currentPage + 1);
						setCurrentPage(currentPage + 1);
					}}
				>
					&gt;
				</PageNumberButton>
				<PageNumberButton disabled={currentPage === pageCount}>&gt;&gt;</PageNumberButton>
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
			...[...pageArr].slice(0, 5)
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