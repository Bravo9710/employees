
import React, { useState } from "react";
import "./styles.css";

function App  () {
	const [ data, setData ] = useState();

	const uploadFile = function(e){
		const file = e.target.files.item(0)
		const reader = new FileReader();
		
		reader.onload = function() {
			const result = reader.result.split('\n').filter( value => value !== '')
			const keys = ['employeeID', 'projectID', 'dateFrom', 'dateTo']
			let pairs = [];
			let daysTogether = [];
			const dataAsJSON = result.map( (line, index) => {
				return line.split(', ').reduce((object, value, index) => ({ ...object, [keys[index]]: value}), {})
			})

			dataAsJSON.forEach((project) => {
				dataAsJSON.slice(dataAsJSON.indexOf(project) + 1, dataAsJSON.length).forEach((pairProject, index) => {
					if (project.employeeID !== pairProject.employeeID) {
						const dateFromEmployee1 = new Date(project.dateFrom);
						const dateToEmployee1 = project.dateTo === "NULL" ? new Date() : new Date(project.dateTo);
						const dateFromEmployee2 = new Date(pairProject.dateFrom);
						const dateToEmployee2 = pairProject.dateTo === "NULL" ? new Date() : new Date(pairProject.dateTo);

						if (project.projectID === pairProject.projectID) {
							if (dateFromEmployee1 <= dateToEmployee2 && dateFromEmployee2 <= dateToEmployee1) {
								const startDate = dateFromEmployee1 <= dateFromEmployee2 ? dateFromEmployee2 : dateFromEmployee1;
								const endDate = dateToEmployee1 <= dateToEmployee2 ? dateToEmployee1 : dateToEmployee2;


								if (endDate >= startDate) {
									const time = Math.abs(endDate - startDate);
									const days = Math.ceil(time / (1000 * 60 * 60 * 24));
									const x = `${project.employeeID}${pairProject.employeeID}`;

									if (daysTogether.indexOf(x) < 0) {
										daysTogether.push([x, days]);
									}

									if (pairs.indexOf(x) < 0) {
										pairs.push([project.employeeID, pairProject.employeeID, project.projectID, days]);
									}
								}
							}
						}
					}
				});
			})

			setData(pairs.sort((a, b) => { return b[3] - a[3] }))
		}

		reader.readAsText(file);
	};

	return (
		<div className="app">
			<h2>Pair of employees who have worked together</h2>

			<h2>Choose file</h2>

			<input type="file" onChange={ uploadFile }/>

			{data ? 
				(
					<table>
						<thead>
							<tr>
								<th>Employee ID #1</th>

								<th>Employee ID #2</th>

								<th>Project ID</th>

								<th>Days worked</th>
							</tr>
						</thead>
						
						<tbody>
							{data.map((pair) => { 
								return(
									<tr key={`${pair[0]}${pair[1]}`}>
										<td>{pair[0]}</td>

										<td>{pair[1]}</td>

										<td>{pair[2]}</td>

										<td>{pair[3]}</td>
									</tr>
									)
								} 
							)}
						</tbody>
					</table>
				) : ''
			}
		</div>
	);
}

export default App;

