
import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Table, 
    Container, 
    Col, 
    Row,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Label
        } from 'reactstrap';

export default class Formulario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            cidades: '',
            cidade: '',
            dia: '',
            previsao: '',
            maxima: '',
            minima: '',
            iuv: '',
            erroMsg: ''
        };
    }

    getTempo = sigla => {
        return {
            'ec': 'Encoberto com Chuvas Isoladas',
            'ci': 'Chuvas Isoladas',
            'c': 'Chuva',
            'in': 'Instável',
            'pp': 'Poss. de Pancadas de Chuva',
            'cm': 'Chuva pela Manhã',
            'cn': 'Chuva a Noite',
            'pt': 'Pancadas de Chuva a Tarde',
            'pm': 'Pancadas de Chuva pela Manhã',
            'np': 'Nublado e Pancadas de Chuva',
            'pc': 'Pancadas de Chuva',
            'pn': 'Parcialmente Nublado',
            'cv': 'Chuvisco',
            'ch': 'Chuvoso',
            't': 'Tempestade',
            'ps': 'Predomínio de Sol',
            'e': 'Encoberto',
            'n': 'Nublado',
            'cl': 'Céu Claro',
            'nv': 'Nevoeiro',
            'g': 'Geada',
            'ne': 'Neve',
            'nd': 'Não Definido',
            'pnt': 'Pancadas de Chuva a Noite',
            'psc': 'Possibilidade de Chuva',
            'pcm': 'Possibilidade de Chuva pela Manhã',
            'pct': 'Possibilidade de Chuva a Tarde',
            'pcn': 'Possibilidade de Chuva a Noite',
            'npt': 'Nublado com Pancadas a Tarde',
            'npn': 'Nublado com Pancadas a Noite',
            'ncn': 'Nublado com Poss. de Chuva a Noite',
            'nct': 'Nublado com Poss. de Chuva a Tarde',
            'ncm': 'Nubl. c/ Poss. de Chuva pela Manhã',
            'npm': 'Nublado com Pancadas pela Manhã',
            'npp': 'Nublado com Possibilidade de Chuva',
            'vn': 'Variação de Nebulosidade',
            'ct': 'Chuva a Tarde',
            'ppn': 'Poss. de Panc. de Chuva a Noite',
            'ppt': 'Poss. de Panc. de Chuva a Tarde',
            'ppm': 'Poss. de Panc. de Chuva pela Manhã'
        }[sigla];
    }

    formatData = data => {
        let d = data.split('-');
        return d[2] + '/' + d[1] + '/' + d[0];
    }

    fetchCidades = e => {
        this.setState({
            nome: e.target.value
        });
        if (e.target.value.length >= 3) {
            e.preventDefault();
            let nome = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            this.setState({ erro: '' });
            fetch(`http://servicos.cptec.inpe.br/XML/listaCidades?city=${nome}`, { method: "GET" }, {
                mode: 'cors',
                method: 'GET',
                headers: new Headers({
                    'Accept': 'application/xml',
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT',
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
            })
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    let decoder = new TextDecoder("iso-8859-1");
                    return decoder.decode(buffer);
                })
                .then(str => {
                    let parser = new window.DOMParser()
                    let xml = parser.parseFromString(str, "text/xml");
                    let cidades = xml.getElementsByTagName('cidades')[0]; // Obter a tag cidades
                    let ID = xml.getElementsByTagName('id')[0];
                    let lista = [];
                    lista.push(<option size="xs" key='-i' value='' >Selecione a cidade</option>)
                    cidades.childNodes.forEach((obj, index) => {
                        return lista.push(
                        <option size="xs" key={index} value={obj.childNodes[2].childNodes[0].nodeValue}>
                            {obj.childNodes[0].childNodes[0].nodeValue} - {obj.childNodes[1].childNodes[0].nodeValue}
                            </option>)
                    });
                    this.setState({ cidades: lista })
                })
                .catch(erro => console.log(erro));
        }
    }

    fetchClima = e => { 
        if (e.target.value !== '') {
            fetch(`http://servicos.cptec.inpe.br/XML/cidade/${e.target.value}/previsao.xml`, { method: 'GET' })
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    let decoder = new TextDecoder("iso-8859-1");
                    return decoder.decode(buffer);
                })
                .then(str => { 
                    let parser = new window.DOMParser()
                    let xml = parser.parseFromString(str, "text/xml");
                    let cidade = xml.getElementsByTagName('nome')[0].firstChild.textContent;
                    let UF = xml.getElementsByTagName('uf')[0].firstChild.textContent;
                    let diaSearch = this.formatData(xml.getElementsByTagName('atualizacao')[0].firstChild.textContent);
                                        
                    let lista = [];
                    lista.push(cidade," - ", UF, "(", diaSearch, ")");
                    this.setState({cidade: lista})
                    
                    let dia0 = this.formatData(xml.getElementsByTagName('previsao')[0].getElementsByTagName('dia')[0].firstChild.nodeValue);
                    let cond0 = this.getTempo(xml.getElementsByTagName('previsao')[0].getElementsByTagName('tempo')[0].firstChild.nodeValue);
                    let max0 = xml.getElementsByTagName('previsao')[0].getElementsByTagName('maxima')[0].firstChild.nodeValue;
                    let min0 = xml.getElementsByTagName('previsao')[0].getElementsByTagName('minima')[0].firstChild.nodeValue;
                    let iuv0 = xml.getElementsByTagName('previsao')[0].getElementsByTagName('iuv')[0].firstChild.nodeValue;                      
                    
                    let dia1 = this.formatData(xml.getElementsByTagName('previsao')[1].getElementsByTagName('dia')[0].firstChild.nodeValue);
                    let cond1 = this.getTempo(xml.getElementsByTagName('previsao')[1].getElementsByTagName('tempo')[0].firstChild.nodeValue);
                    let max1 = xml.getElementsByTagName('previsao')[1].getElementsByTagName('maxima')[0].firstChild.nodeValue;
                    let min1 = xml.getElementsByTagName('previsao')[1].getElementsByTagName('minima')[0].firstChild.nodeValue;
                    let iuv1 = xml.getElementsByTagName('previsao')[1].getElementsByTagName('iuv')[0].firstChild.nodeValue;
                    
                    let dia2 = this.formatData(xml.getElementsByTagName('previsao')[2].getElementsByTagName('dia')[0].firstChild.nodeValue);
                    let cond2 = this.getTempo(xml.getElementsByTagName('previsao')[2].getElementsByTagName('tempo')[0].firstChild.nodeValue);
                    let max2 = xml.getElementsByTagName('previsao')[2].getElementsByTagName('maxima')[0].firstChild.nodeValue;
                    let min2 = xml.getElementsByTagName('previsao')[2].getElementsByTagName('minima')[0].firstChild.nodeValue;  
                    let iuv2 = xml.getElementsByTagName('previsao')[2].getElementsByTagName('iuv')[0].firstChild.nodeValue;
                    
                    let dia3 = this.formatData(xml.getElementsByTagName('previsao')[3].getElementsByTagName('dia')[0].firstChild.nodeValue);
                    let cond3 = this.getTempo(xml.getElementsByTagName('previsao')[3].getElementsByTagName('tempo')[0].firstChild.nodeValue);
                    let max3 = xml.getElementsByTagName('previsao')[3].getElementsByTagName('maxima')[0].firstChild.nodeValue;
                    let min3 = xml.getElementsByTagName('previsao')[3].getElementsByTagName('minima')[0].firstChild.nodeValue;  
                    let iuv3 = xml.getElementsByTagName('previsao')[3].getElementsByTagName('iuv')[0].firstChild.nodeValue;                

                    let lista1 = [dia0, dia1, dia2, dia3];
                    let listday = [];
                    lista1.forEach((valor, index) => {
                        listday.push(<td key={index}>{valor}</td>);
                    });
                    this.setState({dia: listday});
                    
                    let lista2 = [cond0,cond1,cond2,cond3];
                    let listCond = [];
                    lista2.forEach((valor, index) => {
                        listCond.push(<td key={index}>{valor}</td>);
                    });
                    this.setState({previsao: listCond});
                    
                    let lista3 = [max0,max1,max2,max3];
                    let listMax = [];
                    lista3.forEach((valor, index) => {
                        listMax.push(<td key={index}>{valor}</td>);
                    });
                    this.setState({maxima: listMax});

                    let lista4 = [min0,min1,min2,min3];
                    let listMin = [];
                    lista4.forEach((valor, index) => {
                        listMin.push(<td key={index}>{valor}</td>);
                    });
                    this.setState({minima: listMin}); 

                    let lista5 = [iuv0,iuv1,iuv2,iuv3];
                    let listIuv = [];
                    lista5.forEach((valor, index) => {
                        listIuv.push(<td key={index}>{valor}</td>);
                    });
                    this.setState({iuv: listIuv}); 
                })
                .catch(erro => console.log(erro));
        }
    };

    render() {
        let cidades = this.state.cidades;
        let cidade = this.state.cidade;
        let listdia = this.state.dia;
        let listPrevisao = this.state.previsao;
        let listMaxima = this.state.maxima;
        let listMinima = this.state.minima;
        let listUV = this.state.iuv;
          
        return (
            <div>
                <Form onSubmit={this.fetchCidades} >
                    <FormGroup>
                        <InputGroup>
                            <Col sm="12" md="6">
                                <Label>Nome:
                                    <Input size="sm" type='text' value={this.state.value}
                                        onChange={this.fetchCidades}
                                        placeholder="digite o nome completo"
                                        className="py-0"
                                    />
                                </Label>
                            </Col>
                            <Col size="sm" sm="12" md="6">
                                <Label>Cidades:
                                    <Input size="sm" type="select" onChange={this.fetchClima} className="py-0" color="light" hover>
                                        {cidades}
                                    </Input>
                                </Label>
                            </Col>
                            </InputGroup>
                        <div>
                            {this.state.erroMsg}
                        </div>
                    </FormGroup>
                </Form>
                <div>
                    <Table bordered responsive>
                        <thead>
                            <tr>
                                <th className="text-center" colSpan="5">
                                    {cidade}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Dia</th>
                                {listdia}
                            </tr>
                            <tr>
                                <th>Condições do tempo</th>                                
                                {listPrevisao}
                            </tr>
                            <tr>
                                <th>Temp. máxima</th>                                
                                {listMaxima}
                            </tr>
                            <tr>
                                <th>Temp. mínima</th>                                
                                {listMinima}
                            </tr>
                            <tr>
                                <th>Índice ultravioleta</th>                                
                                {listUV}
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }

}
                                      
