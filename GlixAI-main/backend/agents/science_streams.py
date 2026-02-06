"""
GlixAI Science Streams Module
PCM (Physics/Chemistry/Maths), PCB (Physics/Chemistry/Biology), PCMB (Integrated)
"""

SCIENCE_STREAMS = {
    "pcm": {
        "title": "Physical Sciences & Engineering",
        "full_name": "Physics, Chemistry, Mathematics",
        "keywords": [
            "calculus", "quantum mechanics", "python", "matlab", "cad",
            "thermodynamics", "electromagnetism", "linear algebra",
            "differential equations", "numerical methods", "mechanics",
            "optics", "semiconductor physics", "signal processing",
            "control systems", "structural analysis", "fluid dynamics"
        ],
        "portals": ["IEEE", "MathJobs", "Dice", "EngineerJobs", "ACM"],
        "roles": [
            "research scientist", "data scientist", "software engineer",
            "mechanical engineer", "electrical engineer", "quantitative analyst",
            "physics researcher", "computational scientist", "systems engineer"
        ],
        "certifications": [
            "AWS Machine Learning Specialty",
            "Professional Engineer (PE)",
            "Certified SolidWorks Associate"
        ]
    },
    "pcb": {
        "title": "Life Sciences & Medicine",
        "full_name": "Physics, Chemistry, Biology",
        "keywords": [
            "molecular biology", "organic chemistry", "crispr", "hplc",
            "genetics", "microbiology", "biochemistry", "pharmacology",
            "cell biology", "immunology", "genomics", "proteomics",
            "clinical trials", "biostatistics", "epidemiology",
            "drug discovery", "pathology", "toxicology"
        ],
        "portals": ["NatureCareers", "BioSpace", "ScienceCareers", "NewScientist", "ResearchGate"],
        "roles": [
            "research scientist", "biotech researcher", "clinical researcher",
            "pharmaceutical scientist", "lab technician", "bioinformatician",
            "medical writer", "regulatory affairs specialist", "quality analyst"
        ],
        "certifications": [
            "Clinical Research Associate (CRA)",
            "Good Manufacturing Practice (GMP)",
            "Biosafety Level Training"
        ]
    },
    "pcmb": {
        "title": "Integrated Science",
        "full_name": "Physics, Chemistry, Mathematics, Biology",
        "keywords": [
            "bioinformatics", "biophysics", "data science", "computational biology",
            "biomedical engineering", "systems biology", "mathematical modeling",
            "machine learning", "statistical analysis", "scientific computing",
            "medical imaging", "neural engineering", "biomechanics"
        ],
        "portals": ["NatureCareers", "IEEE", "BioSpace", "ACM", "ScienceCareers"],
        "roles": [
            "bioinformatics scientist", "data scientist", "ml engineer",
            "biomedical engineer", "computational biologist", "ai researcher",
            "research scientist", "quantitative biologist"
        ],
        "certifications": [
            "Google Professional ML Engineer",
            "AWS Data Analytics Specialty",
            "Bioinformatics Certification"
        ]
    }
}

# Extended Full-Form Map for Science domains
SCIENCE_FULL_FORMS = {
    "hplc": "High-Performance Liquid Chromatography",
    "gcms": "Gas Chromatography-Mass Spectrometry",
    "nmr": "Nuclear Magnetic Resonance",
    "pcr": "Polymerase Chain Reaction",
    "crispr": "Clustered Regularly Interspaced Short Palindromic Repeats",
    "dna": "Deoxyribonucleic Acid",
    "rna": "Ribonucleic Acid",
    "mrna": "Messenger RNA",
    "elisa": "Enzyme-Linked Immunosorbent Assay",
    "sds-page": "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis",
    "cad": "Computer-Aided Design",
    "cam": "Computer-Aided Manufacturing",
    "fem": "Finite Element Method",
    "cfd": "Computational Fluid Dynamics",
    "fea": "Finite Element Analysis",
    "plc": "Programmable Logic Controller",
    "scada": "Supervisory Control and Data Acquisition",
    "vlsi": "Very Large Scale Integration",
    "fpga": "Field-Programmable Gate Array",
    "asic": "Application-Specific Integrated Circuit",
    "soc": "System on Chip",
    "iot": "Internet of Things",
    "gmp": "Good Manufacturing Practice",
    "glp": "Good Laboratory Practice",
    "gcp": "Good Clinical Practice",
    "fda": "Food and Drug Administration",
    "ema": "European Medicines Agency",
    "who": "World Health Organization",
    "ir": "Infrared Spectroscopy",
    "uv": "Ultraviolet Spectroscopy",
    "xrd": "X-Ray Diffraction",
    "sem": "Scanning Electron Microscopy",
    "tem": "Transmission Electron Microscopy",
    "afm": "Atomic Force Microscopy",
    "ct": "Computed Tomography",
    "mri": "Magnetic Resonance Imaging",
    "pet": "Positron Emission Tomography",
    "ecg": "Electrocardiogram",
    "eeg": "Electroencephalogram",
    "emg": "Electromyography",
    "matlab": "Matrix Laboratory",
    "r": "R Programming Language",
    "spss": "Statistical Package for Social Sciences",
    "sas": "Statistical Analysis System",
}


def get_stream_info(stream_code: str) -> dict:
    """Get science stream information"""
    return SCIENCE_STREAMS.get(stream_code.lower(), {})


def get_stream_roles(stream_code: str) -> list:
    """Get recommended roles for a science stream"""
    stream = SCIENCE_STREAMS.get(stream_code.lower(), {})
    return stream.get("roles", [])


def get_stream_portals(stream_code: str) -> list:
    """Get relevant job portals for a stream"""
    stream = SCIENCE_STREAMS.get(stream_code.lower(), {})
    return stream.get("portals", [])


def match_stream_keywords(user_skills: list, stream_code: str) -> dict:
    """Match user skills against stream keywords"""
    stream = SCIENCE_STREAMS.get(stream_code.lower(), {})
    if not stream:
        return {"matched": [], "missing": [], "score": 0}

    stream_kw = set(k.lower() for k in stream.get("keywords", []))
    user_kw = set(s.lower() for s in user_skills)

    matched = list(user_kw.intersection(stream_kw))
    missing = list(stream_kw - user_kw)

    score = round(len(matched) / max(len(stream_kw), 1) * 100, 1)
    return {"matched": matched, "missing": missing[:10], "score": score}
