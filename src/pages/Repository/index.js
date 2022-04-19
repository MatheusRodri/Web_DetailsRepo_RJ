import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton, IssuesList, PageAction,FilterList } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

export default function Repository() {

    const nameRepo = decodeURIComponent(useParams().repository);
    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState([
        {state:"all",label:'All',active:true},
        {state:"open",label:'Open',active:false},
        {state:"closed",label:'Closed',active:false}
    ]);

    const [filterIndex, setFilterIndex] = useState(0);

    useEffect(() => {
        async function loadRepository() {
            const [repositoryData, issuesData] = await Promise.all([
                api.get(`/repos/${nameRepo}`),
                api.get(`/repos/${nameRepo}/issues`, {
                    params: {
                        state: filter.find(f => f.active).state,
                        per_page: 5,
                    }
                })
            ]);

            setRepository(repositoryData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }
        loadRepository();
    }, [useParams().repository]);

    useEffect(() => {
        async function loadIssues() {
            const response = await api.get(`/repos/${nameRepo}/issues`, {
                params: {
                    state: filter[filterIndex].state,
                    page,
                    per_page: 5,
                },
            });
            setIssues(response.data);
        }
        loadIssues();
    }, [filter,filterIndex,page])

    function handlePage(action) {
        setPage(action === "back" ? page - 1 : page + 1);
    }

    function handleFilter(index){
        setFilterIndex(index);
    }
    if (loading) {
        return <Loading><h1>Carregando...</h1></Loading>
    }
    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft size={20} color="#000" />
            </BackButton>
            <Owner>
                <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                <h1>{repository.name}</h1>
                <p>{repository.description}</p>
            </Owner>

            <FilterList active={filterIndex}>
                {filter.map((filter,index)=>(
                    <button type="button" key={filter.label} onClick={()=>handleFilter(index)}>
                        {filter.label}
                    </button>
                
                ))}

            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p> Owner is {issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageAction>
                <button
                    type="button"
                    onClick={() => handlePage("Back")}
                    disabled={page<2}
                    >
                    Back

                </button>
                <button type="button" onClick={() => handlePage('next')}>Next</button>
            </PageAction>
        </Container>
    )
} 