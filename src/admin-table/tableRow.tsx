import { useEffect, useState } from "react";
import { TableColumn, TableRowProps } from "./table.types";
import { TableRowActionType } from "./Table";

const TableRow = ({rowData, columnData, update, rowDelete, tableRowDispatch}: TableRowProps) => {

	const [editMode, setEditMode] = useState<boolean>(false);
	const [rowValue, setRowValue] = useState(rowData);
	const [oldData, setOldData] = useState(rowData);

	const handleRowValueChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
		
		const {name, value} = target;

		setRowValue(({
			...rowValue,
			[name]: value
		}));
	};

	return (
		<div className={`flex flex-row space-y-2 hover:bg-gray-200 ${rowData.selected ? 'highlighted-row' : undefined}`}>
			<div className="flex flex-row justify-center pl-8 py-3">
				<input 
					type='checkbox'
					checked={rowData.selected ?? false}
					onChange={() => {
						tableRowDispatch({
							type: TableRowActionType.TOGGLE_SELECTED,
							payload: rowData.id
						});
					}}
				/>
			</div>

			{columnData.map(column => 
				<div key={column['field']}
					className="text-center"
					style={{ width: `${column["width"]}%` }}
				>
					{editMode
						? <input 
								type="text" 
								value={rowValue[column['field']]} 
								name={column['field']} 
								onChange={handleRowValueChange}
								className="border py-2 px-3 text-grey-darkest text-center"
							/> 
						: <div className="w-full align-middle py-2">{rowData[column['field']]}</div>
					}
				</div>
			)}

			<div className='flex flew-row gap-3'>
				{editMode
					? <button 
							onClick={() => {
								console.log('Save clicked');

								try {
									const rowAfterUpdate = update(oldData, rowValue);
									setRowValue(rowAfterUpdate);
								} catch (error) {
									console.error(error);
									setRowValue(oldData);
								}

								setEditMode(false);
							}}
						>
							Save
						</button>
					: <button 
							onClick={() => {
								setEditMode(true);
								setOldData(rowValue);
							}}
							className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
						>
							Edit
						</button>
				}
				{editMode
					? <button 
							onClick={() => {
								setEditMode(false);
								setRowValue(oldData);
							}}
						>
							Cancel
						</button>
					: <button 
							onClick={() => {
								try {
									rowDelete(rowData.id);
								} catch (error) {
									console.error(error);
								}
							}}
							className="bg-transparent hover:bg-red-400 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
						>
							Delete
						</button>
					}
			</div>
		</div>
	);
};

export default TableRow;