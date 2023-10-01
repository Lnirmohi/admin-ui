import { useState } from "react";
import { TableRowProps } from "../types/table.types.js";

export function TableRow({rowData, columnData, update, rowDelete, children}: TableRowProps) {

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
		<div className={`flex flex-row py-2 hover:shadow-inner hover:bg-gray-200 ${rowData.selected ? 'bg-slate-100 shadow-inner' : ''}`}>
			{children}

			{columnData.map(column => {

				const fieldVal = rowValue[column['field']] as string;

				const value = column.transform 
					? column.transform(fieldVal)
					: fieldVal;

				return (
					<div key={column['field']}
						className="text-center ml-2"
						style={{ width: `${column["width"]}%` }}
					>
						{editMode
							? <input 
									type="text" 
									value={value} 
									name={column['field']} 
									onChange={handleRowValueChange}
									className="border py-2 px-3 text-grey-darkest text-center w-full"
								/> 
							: <div className="w-full align-middle py-2">{value}</div>
						}
					</div>
				);
			}
			)}

			<div className='flex flew-row gap-3 justify-center ml-4'>
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
							className="bg-transparent hover:bg-green-300 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
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
							className="bg-transparent hover:bg-slate-300 text-slate-500 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded"
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
}
