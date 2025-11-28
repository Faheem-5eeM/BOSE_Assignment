const stages = ["Applied", "Screening", "Interview", "Technical", "Offer", "Hired", "Rejected"]

const jobTitles = [
  "Senior Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Data Scientist",
  "Mobile Developer",
  "QA Engineer",
  "Tech Lead",
  "Cloud Architect",
  "ML Engineer",
]

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Spotify",
  "Uber",
  "Airbnb",
  "Stripe",
  "Shopify",
  "Slack",
  "Zoom",
  "Salesforce",
  "Adobe",
  "Oracle",
  "Freshworks",
  "Razorpay",
  "PhonePe",
  "Swiggy",
  "Zomato",
  "Flipkart",
  "Ola",
  "Paytm",
  "CRED",
]

const institutions = [
  "MIT",
  "Stanford University",
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "NIT Trichy",
  "BITS Pilani",
  "VIT Vellore",
  "IIT Kanpur",
  "IIT Kharagpur",
  "Harvard University",
  "UC Berkeley",
  "Carnegie Mellon",
  "Georgia Tech",
]

const degrees = [
  "B.Tech Computer Science",
  "M.Tech Software Engineering",
  "B.E. Information Technology",
  "MCA",
  "BCA",
  "M.Sc Computer Science",
  "MBA",
  "Ph.D Computer Science",
  "B.Sc Computer Science",
]

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayaan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharva",
  "Advik",
  "Pranav",
  "Priya",
  "Ananya",
  "Aanya",
  "Aadhya",
  "Saanvi",
  "Ishita",
  "Diya",
  "Pari",
  "Anvi",
  "Myra",
  "Sara",
  "Anika",
  "Navya",
  "Avni",
  "Kiara",
  "Riya",
  "Sneha",
  "Pooja",
  "Neha",
  "Divya",
  "Rahul",
  "Amit",
  "Vikram",
]

const lastNames = [
  "Sharma",
  "Verma",
  "Gupta",
  "Singh",
  "Kumar",
  "Patel",
  "Reddy",
  "Nair",
  "Iyer",
  "Menon",
  "Pillai",
  "Rao",
  "Joshi",
  "Kulkarni",
  "Deshmukh",
  "Patil",
  "Shah",
  "Mehta",
  "Chopra",
  "Malhotra",
  "Kapoor",
  "Banerjee",
  "Mukherjee",
  "Das",
  "Roy",
  "Sen",
  "Ghosh",
]

function createSeededRandom(seed) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// Create a single seeded random instance
const seededRandom = createSeededRandom(42)

function randomElement(arr) {
  return arr[Math.floor(seededRandom() * arr.length)]
}

function randomNumber(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min
}

function randomDate(start, end) {
  const date = new Date(start.getTime() + seededRandom() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

function generateCandidate(index) {
  const firstName = randomElement(firstNames)
  const lastName = randomElement(lastNames)
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(1, 99)}@email.com`

  const numJobs = randomNumber(1, 4)
  const jobs = Array.from({ length: numJobs }, (_, i) => ({
    id: `job-${index}-${i}`,
    jobTitle: randomElement(jobTitles),
    stage: randomElement(stages),
    appliedDate: randomDate(new Date("2024-01-01"), new Date("2024-11-28")),
  }))

  const numEducation = randomNumber(1, 3)
  const education = Array.from({ length: numEducation }, (_, i) => ({
    id: `edu-${index}-${i}`,
    degree: randomElement(degrees),
    institution: randomElement(institutions),
    year: randomNumber(2015, 2024),
  }))

  return {
    id: `candidate-${index}`,
    name,
    email,
    mobile: `+91 ${randomNumber(70000, 99999)} ${randomNumber(10000, 99999)}`,
    jobs,
    currentCompany: randomElement(companies),
    education,
    appliedDate: randomDate(new Date("2024-01-01"), new Date("2024-11-28")),
    expectedSalary: randomNumber(5, 50) * 100000,
  }
}

export const mockCandidates = Array.from({ length: 2500 }, (_, i) => generateCandidate(i))
export const allJobTitles = jobTitles
export const allStages = stages
export const allCompanies = companies
