import { promises as fs, existsSync, mkdirSync } from 'fs';

init();

async function init() {
	try {
		const dir = './cidades';
		const estados = JSON.parse(await fs.readFile('Estados.json', 'utf-8'));
		const cidades = JSON.parse(await fs.readFile('Cidades.json', 'utf-8'));

		if (!existsSync(dir)) {
			mkdirSync(dir);
		}

		Promise.all(
			estados.map(async estado => {
				const cidadesPorEstado = cidades.filter(cidade => cidade.Estado === estado.ID);
				await fs.writeFile(`${dir}/${estado.Sigla}.json`, JSON.stringify(cidadesPorEstado, null, 2));
			})
		);

		console.log(`Número Cidades => RJ - ${await getNumCidades('RJ')}`);

		console.log('\n5 Estados com mais cidades:');
		(await getMaiorNumCidades(5)).forEach(cidade => console.log(`${cidade.sigla} - ${cidade.numCidades}`));

		console.log('\n5 Estados com menos cidades:');
		(await getMenorNumCidades(5)).forEach(cidade => console.log(`${cidade.sigla} - ${cidade.numCidades}`));

		console.log('\nMaior nome de cidade por estado:');
		await printCidadesComSiglaEstado(getCidadeMaiorNome);

		console.log('\nMenor nome de cidade por estado:');
		await printCidadesComSiglaEstado(getCidadeMenorNome);

		console.log('\nCidade com maior nome:');
		await printCidadesComMaiorNome();

		console.log('\nCidade com menor nome:');
		await printCidadesComMenorNome();
	} catch (err) {
		console.log(err);
	}
}

async function getNumCidades(estado) {
	const cidades = JSON.parse(await fs.readFile(`cidades/${estado}.json`, 'utf-8'));
	return cidades.length;
}

async function getListaCidades() {
	const estados = JSON.parse(await fs.readFile('Estados.json', 'utf-8'));
	const cidades = await Promise.all(
		estados.map(async estado => {
			const n = await getNumCidades(estado.Sigla);

			return {
				sigla: estado.Sigla,
				numCidades: n,
			};
		})
	);

	return cidades;
}

async function getMaiorNumCidades(size) {
	const cidades = await getListaCidades();
	cidades.sort((a, b) => b.numCidades - a.numCidades);
	return cidades.slice(0, size);
}

async function getMenorNumCidades(size) {
	const cidades = await getListaCidades();
	cidades.sort((a, b) => a.numCidades - b.numCidades);
	return cidades.slice(0, size);
}

async function printCidadesComSiglaEstado(funcao) {
	const estados = JSON.parse(await fs.readFile('Estados.json', 'utf-8'));
	await Promise.all(
		estados.map(async estado => {
			console.log(`${await funcao(estado.Sigla)} - ${estado.Sigla}`);
		})
	);
}

async function printCidadesComMaiorNome() {
	const estados = JSON.parse(await fs.readFile('Estados.json', 'utf-8'));
	const cidades = await Promise.all(
		estados.map(async estado => {
			return {
				nome: await getCidadeMaiorNome(estado.Sigla),
				siglaEstado: estado.Sigla,
			};
		})
	);
	cidades.sort((a, b) => {
		if (a.nome.length == b.nome.length) {
			return b.nome.localeCompare(a.nome);
		}

		return b.nome.length - a.nome.length;
	});
	console.log(`${cidades[0].nome} - ${cidades[0].siglaEstado}`);
}

async function printCidadesComMenorNome() {
	const estados = JSON.parse(await fs.readFile('Estados.json', 'utf-8'));
	const cidades = await Promise.all(
		estados.map(async estado => {
			return {
				nome: await getCidadeMenorNome(estado.Sigla),
				siglaEstado: estado.Sigla,
			};
		})
	);
	cidades.sort((a, b) => {
		if (a.nome.length == b.nome.length) {
			return a.nome.localeCompare(b.Nome);
		}

		return a.nome.length - b.nome.length;
	});
	console.log(`${cidades[0].nome} - ${cidades[0].siglaEstado}`);
}

async function getCidadeMaiorNome(estado) {
	const cidades = JSON.parse(await fs.readFile(`cidades/${estado}.json`, 'utf-8'));
	cidades.sort((a, b) => {
		if (a.Nome.length == b.Nome.length) {
			return b.Nome.localeCompare(a.Nome);
		}

		return b.Nome.length - a.Nome.length;
	});
	return cidades[0].Nome;
}

async function getCidadeMenorNome(estado) {
	const cidades = JSON.parse(await fs.readFile(`cidades/${estado}.json`, 'utf-8'));
	cidades.sort((a, b) => {
		if (a.Nome.length == b.Nome.length) {
			return a.Nome.localeCompare(b.Nome);
		}

		return a.Nome.length - b.Nome.length;
	});
	return cidades[0].Nome;
}
