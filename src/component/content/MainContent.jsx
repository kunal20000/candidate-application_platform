import React, { useEffect, useRef, useState } from "react";
import "./maincontent.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const MainContent = () => {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all"); // State for selected role
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected number of employees
  const [selectedExperience, setSelectedExperience] = useState(""); // State for selected experience
  const [selectedRemote, setSelectedRemote] = useState(""); // State for selected remote option
  const [selectedSalary, setSelectedSalary] = useState(""); // State for selected minimum base pay salary
  const [selectedCompany, setSelectedCompany] = useState(""); // State for selected company name
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded job
  const [expandedIndices, setExpandedIndices] = useState([]); // State for expanded job indices
  const observer = useRef(); // Ref for intersection observer


  // Headers and body for API request
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const body = JSON.stringify({
    limit: 10,
    offset: 0, // adjust offset based on pagination
    role: selectedRole, // Include selected role in request body
    location: selectedLocation, // Include selected number of employees in request body
    experiences: selectedExperience, // Include selected experience in request body
    remote: selectedRemote, // Include selected remote option in request body
    salary: selectedSalary,
    company: selectedCompany,
    searchTerm,
  });

  const requestOptions = {
    method: "post",
    headers: myHeaders,
    body,
  };
    // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resData = await fetch(
        `https://api.weekday.technology/adhoc/getSampleJdJSON?page=${page}&role=${selectedRole}&employees=${selectedLocation}&experience=${selectedExperience}&salary=${selectedSalary}&searchTerm=${searchTerm}`,
        requestOptions
      );
      const data = await resData.json();
      console.log("data", data);
      if (data.jdList && data.jdList.length > 0) {
        setContent((prevContent) => [...prevContent, ...data.jdList]);
        setHasMore(data.jdList.length === 10); // Assuming 10 is the limit per page
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };


 // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData();
  }, [
    selectedRole,
    selectedLocation,
    selectedExperience,
    selectedSalary,
    searchTerm,
  ]);


  // Fetch more data on pagination change
  useEffect(() => {
    fetchData();
  }, [page]);

  // Intersection observer to trigger pagination
  useEffect(() => {
    if (!hasMore) return;
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, options);

    const currentObserver = observer.current;

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [hasMore]);

  // Fetch data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  // Event handler for role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setSelectedRole(selectedRole);
    console.log("selectedRole", selectedRole);
    // reset content pagination when role changes
    setContent([]);
    setPage(1);
    setHasMore(true);
  };

  // event handler for search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset content and pagination when search term changes
    setContent([]);
    setPage(1);
    setHasMore(true);
  };
 // Event handler for location change
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setContent([]);
    setPage(1);
    setHasMore(true);
  };

// Event handler for experience change
  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
    setContent([]);
    setPage(1);
    setHasMore(true);
  };

  // Event handler for salary change
  const handleSalaryChange = (e) => {
    setSelectedSalary(e.target.value);
    setContent([]);
    setPage(1);
    setHasMore(true);
  };

  // Function to toggle the expanded state
  const toggleExpand = (index) => {
    setExpandedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };
  return (
    <div className="job-portal">
      <div className="job-filter-container">
         {/* Role filter */}
        <div className="role-container">
          <label htmlFor="role">Roles</label>
          <select
            name="role"
            id="role"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="all">All</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="lead">Tech Lead</option>
            <option value="android">Android</option>
          </select>
        </div>
          {/* Location filter */}
        <div className="role-container">
          <label htmlFor="location">location</label>
          <select
            name="location"
            id="location"
            onChange={handleLocationChange}
            value={selectedLocation}
          >
            <option value="">All</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi ncr">Delhi NCR</option>
            <option value="remote">Remote</option>
            <option value="chennai">Chennai</option>
            <option value="banglore">Banglore</option>
          </select>
        </div>
         {/* Experience filter */}
        <div className="role-container">
          <label htmlFor="experience">Experience</label>
          <select
            name="experience"
            id="experience"
            onChange={handleExperienceChange}
            value={selectedExperience}
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        {/* Salary filter */}
        <div className="role-container">
          <label htmlFor="salary">Minimum Base Pay Salary</label>
          <select
            name="salary"
            id="salary"
            onChange={handleSalaryChange}
            value={selectedSalary}
          >
            <option value="">All</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="30">30</option>
          </select>
        </div>
        {/* Search input */}
        <div className="role-container">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search Company Name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="job-container">
        {content
          .filter(
            (job) =>
              (job.jobRole === selectedRole || selectedRole === "all") &&
              (selectedLocation === "" || job.location === selectedLocation) &&
              (selectedExperience === "" ||
                job.minExp === parseInt(selectedExperience)) &&
              (selectedSalary === "" ||
                job.minJdSalary >= parseInt(selectedSalary)) &&
              (searchTerm === "" ||
                job.companyName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
          .map((job, index) => {
            return (
              <div className="job-card" key={index}>
                <div className="logo-container">
                  <img src={job.logoUrl} alt="job-logo" />
                  <div className="job-info">
                    <h6>{job.companyName} </h6>
                    <p>{job.jobRole}</p>
                    <p>{job.location}</p>
                  </div>
                </div>
                <div className="job-info2">
                  <p>
                    Estimated Salary: {job.minJdSalary ? job.minJdSalary : "0"}{" "}
                    LPA - {job.maxJdSalary ? job.maxJdSalary : "0"} LPA ✅
                  </p>
                  <b>About Company:</b>
                  <br />
                  <strong>About us</strong>
                  <p>
                    {expandedIndices.includes(index)
                      ? job.jobDetailsFromCompany
                      : job.jobDetailsFromCompany.slice(0, 400)}
                    {job.jobDetailsFromCompany.length > 400 &&
                      (!expandedIndices.includes(index) ? (
                        <button
                          className="toggle-btn"
                          onClick={() => toggleExpand(index)}
                        >
                          Show more
                        </button>
                      ) : (
                        <button
                          className="toggle-btn"
                          onClick={() => toggleExpand(index)}
                        >
                          Show less
                        </button>
                      ))}
                  </p>

                  <p>Minimum Experience</p>
                  <p>{job.minExp ? job.minExp : "0"}</p>
                  <button
                    className="apply-btn"
                    onClick={() => toast.success("Successfully Applied!")}
                  >
                   ⚡ Easy Apply
                  </button>
                  <br />
                  <button className="referral-btn" onClick={() => toast.success("Comming Soon")}>🚀 Unlock referral asks</button>
                </div>
              </div>
            );
          })}
        {isLoading && <div>Loading...</div>}
        {hasMore && <div ref={observer}></div>}
      </div>
      <div>
      <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default MainContent;
