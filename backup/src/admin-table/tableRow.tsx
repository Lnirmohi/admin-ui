import { useState } from "react";
import { TableColumn, TableRowProps } from "./table.types";

const TableRow = ({rowData, columnData, update, rowDelete}: TableRowProps) => {

	const [selected, setSelected] = useState<boolean>(false);
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
		<tr className={selected ? 'highlighted-row' : undefined}>
			<td>
				<input 
					type='checkbox'
					checked={selected}
					onChange={() => {setSelected(!selected);}}
				/>
			</td>

			{columnData.map(column => 
				<td key={column['field']}>
					{editMode
						? <input 
								type="text" 
								value={rowValue[column['field']]} 
								name={column['field']} 
								onChange={handleRowValueChange} 
							/> 
						: rowData[column['field']]
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