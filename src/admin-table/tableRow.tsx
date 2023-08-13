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
		<tr className={rowData.selected ? 'highlighted-row' : undefined}>
			<td className="flex flex-row justify-center">
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
			</td>

			{columnData.map(column => 
				<td key={column['field']}
					className="text-center"
					style={{ width: `${column["width"]}%` }}
				>
					{editMode
						? <input 
								type="text" 
								value={rowValue[column['field']]} 
								name={column['field']} 
								onChange={handleRowValueChange}
								className="w-full"
							/> 
						: <div className="w-full">{rowData[column['field']]}</div>
					}
				</td>
			)}

			<td className='table--body__actions'>
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
						>
							Delete
						</button>
					}
			</td>
		</tr>
	);
};

export default TableRow;