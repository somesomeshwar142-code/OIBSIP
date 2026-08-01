# 📡 Technical Research Report: Common Network Security Threats

**Author:** Cybersecurity Research Team  
**Date:** August 2026  
**Document Classification:** Academic & Professional Security Research  
**Target Repository:** `OIBSIP/CyberSecurity-Task4-Network-Security-Threats/network_security_threats_report.md`  

---

## 1. Introduction

In today's hyper-connected digital landscape, network infrastructure serves as the fundamental backbone for international commerce, cloud computing, critical infrastructure, and enterprise communications. However, this ubiquitous connectivity has expanded the organizational attack surface, making networks increasingly vulnerable to sophisticated cyber threats that attempt to compromise confidentiality, integrity, and availability (the CIA triad). As modern network perimeters dissolve due to cloud adoption, remote workforces, and Internet of Things (IoT) expansion, understanding core network security threats—their underlying mechanics, real-world exploitation vectors, and robust mitigation architectures—is an indispensable imperative for modern cybersecurity professionals and network administrators.

---

## 2. Denial of Service (DoS) and Distributed Denial of Service (DDoS) Attacks

### 2.1 Technical Explanation & Mechanics
A **Denial of Service (DoS)** attack occurs when a malicious actor attempts to render a network resource, server, or service unavailable to intended users by overwhelming it with a flood of illegitimate requests or exploiting architectural vulnerabilities. A **Distributed Denial of Service (DDoS)** attack amplifies this threat by utilizing a botnet—a coordinated network of geographically dispersed compromised devices (computers, servers, or insecure IoT units) infected with malware—to launch simultaneous, massive floods of traffic against a targeted infrastructure.

DDoS attacks generally fall into three technical categories:
1. **Volumetric Attacks**: Overwhelm network bandwidth using reflection and amplification techniques (e.g., UDP floods, NTP amplification, DNS amplification).
2. **Protocol / Transport Layer Attacks**: Exhaust connection state tables on network infrastructure devices such as firewalls, load balancers, and web servers (e.g., TCP SYN floods, Ping of Death, Smurf attacks).
3. **Application Layer (Layer 7) Attacks**: Target specific application endpoints by mimicking legitimate HTTP GET/POST requests to consume high application CPU and memory (e.g., HTTP floods, Slowloris).

```
[Attacker / C2 Server]
         │
         ├───► [Botnet Node 1 (IoT Camera)] ────┐
         ├───► [Botnet Node 2 (Router)]     ────┼───► [Target Server] (Resource Exhaustion)
         └───► [Botnet Node 3 (Compromised)] ────┘
```

### 2.2 Documented Real-World Case Study
* **Incident:** *The 2018 GitHub Memcached Amplification DDoS Attack*
* **Context:** In February 2018, popular code repository platform GitHub was struck by an unprecedented DDoS attack peaking at **1.35 Terabits per second (Tbps)** and 126.9 million packets per second.
* **Attack Mechanism:** The attackers utilized spoofed UDP packets directed at exposed, unauthenticated **Memcached** caching servers listening on port 11211. Because Memcached allowed UDP queries with spoofed return addresses, a tiny request generated an amplified response up to **50,000 times larger** sent directly to GitHub's IP addresses.
* **Outcome:** GitHub's automated DDoS defense system (Akamai ProLEXIC) routed and scrubbed the massive volume of traffic, mitigating the outage within 15 minutes without permanent data loss.

### 2.3 Organizational Impact
* **Service Interruption:** Complete unreachability of critical customer-facing portals, APIs, and enterprise applications.
* **Financial Loss:** Direct loss of transaction revenue, SLA contractual non-compliance penalties, and emergency response costs.
* **Operational Distraction:** Security Operations Center (SOC) teams are distracted by volumetric floods while attackers conduct low-and-slow data exfiltration in parallel (smokescreen attack tactic).

### 2.4 Specific Mitigation Strategies
1. **Upstream Anycast BGP Routing & Cloud Scrubbing**: Deploy cloud-based DDoS mitigation providers (e.g., Cloudflare, Akamai ProLEXIC) that utilize Anycast BGP routing to distribute massive volumetric floods across global scrubbing centers before traffic reaches the origin server.
2. **Strict Rate Limiting & Web Application Firewall (WAF) Rules**: Configure edge routers, firewalls, and WAFs to enforce rate-limiting policies on incoming TCP SYN, UDP, and HTTP requests, dropping anomalous spikes originating from single IP blocks or user agents.
3. **Disabling UDP Amplification Vectors & Ingress/Egress Filtering**: Ensure public-facing servers (NTP, DNS, Memcached) do not answer unauthenticated UDP queries externally, and enforce BCP 38 / RFC 2827 IP source address verification to prevent spoofed amplification requests.

---

## 3. Man-in-the-Middle (MITM) Attacks

### 3.1 Technical Explanation & Mechanics
A **Man-in-the-Middle (MITM)** attack is a cryptanalytic and network interception vector where an adversary secretly positions themselves between two communicating endpoints (e.g., a client web browser and a corporate server). By intercepting, relaying, and potentially altering the communications without the knowledge of either party, the attacker can eavesdrop on confidential information or inject malicious payloads into data streams.

Common MITM exploitation techniques include:
* **Address Resolution Protocol (ARP) Poisoning**: Broadcasts spoofed ARP replies across a Local Area Network (LAN) to associate the attacker's MAC address with the IP address of the default gateway, forcing all local subnet traffic through the attacker's machine.
* **SSL/TLS Stripping (e.g., Moxie Marlinspike’s SSLstrip)**: Intercepts HTTP-to-HTTPS redirects, serving an unencrypted HTTP version to the victim while maintaining an encrypted HTTPS connection with the legitimate server.
* **Rogue Wi-Fi Access Points ("Evil Twin")**: Operates an unencrypted wireless access point matching a popular public Wi-Fi SSID to capture all connected clients' unencrypted traffic.

```
[Victim Client] <== (Unencrypted HTTP) ==> [Attacker (MITM Node)] <== (Encrypted HTTPS) ==> [Legitimate Web Server]
```

### 3.2 Documented Real-World Case Study
* **Incident:** *The 2011 DigiNotar Certificate Authority Compromise*
* **Context:** In July 2011, Dutch Certificate Authority (CA) DigiNotar suffered a severe breach where malicious actors compromised their internal infrastructure and issued rogue wildcard SSL/TLS certificates for high-profile domains, including `*.google.com`.
* **Attack Mechanism:** Armed with valid, cryptographically trusted SSL certificates issued by a recognized CA, adversaries in Iran conducted active MITM interception against over 300,000 Iranian users connecting to Google services (Gmail, Google Docs). Because the browser trusted DigiNotar, no SSL warnings were triggered.
* **Outcome:** Major browser vendors (Google Chrome, Mozilla Firefox, Microsoft) revoked DigiNotar's root certificate, forcing DigiNotar into bankruptcy and driving the security industry to adopt HTTP Public Key Pinning (HPKP) and Certificate Transparency (CT) logs.

### 3.3 Organizational Impact
* **Credential & Session Hijacking**: Theft of cleartext passwords, OAuth bearer tokens, and session cookies leading to full account takeover.
* **Data Manipulation & Integrity Compromise**: Interception and unauthorized modification of financial wire transfers, sensitive emails, or software downloads.
* **Eavesdropping on Sensitive Intellectual Property**: Exposure of confidential corporate communications and proprietary research.

### 3.4 Specific Mitigation Strategies
1. **Mandatory HTTPS Enforcement with HSTS Preloading**: Implement **HTTP Strict Transport Security (HSTS)** headers (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`) across all domain assets to ensure web browsers strictly enforce TLS connections and reject unencrypted HTTP fallback attempts.
2. **Dynamic ARP Inspection (DAI) & DHCP Snooping**: Enable DAI and DHCP Snooping on managed enterprise network switches to validate ARP packets against a trusted binding database, dropping unauthorized or spoofed ARP responses instantly.
3. **End-to-End Encryption (E2EE) & Mutual TLS (mTLS)**: Enforce strong end-to-end encryption protocols (TLS 1.3, IPsec, SSH) and mutual client-server certificate authentication (mTLS) so intercepted traffic remains unreadable to network eavesdroppers.

---

## 4. IP Spoofing

### 4.1 Technical Explanation & Mechanics
**IP Spoofing** is the creation of Internet Protocol (IP) packets with a modified or false source IP address in the packet header, designed to conceal the identity of the sender, impersonate another computer system, or trick network defenses into routing responses to an unintended victim.

IP Spoofing operates in two main operational contexts:
1. **Non-Blind IP Spoofing**: The attacker resides on the same subnet as the target, allowing them to inspect responses and sequence numbers to hijack active TCP sessions.
2. **Blind IP Spoofing**: The attacker resides on a different network and cannot see incoming packets. The attacker predicts or estimates TCP sequence numbers (TCP Sequence Number Inference) to inject malicious packets into an established session.

```
+-------------------------------------------------------------+
| Original IP Header: Source IP = 203.0.113.5 (Attacker Real) |
| Spoofed IP Header:  Source IP = 192.168.1.50 (Trusted Host) |
+-------------------------------------------------------------+
```

### 4.2 Documented Real-World Case Study
* **Incident:** *The Landmark 1994 Kevin Mitnick Attack on Tsutomu Shimomura*
* **Context:** On Christmas Day in 1994, hacker Kevin Mitnick executed a legendary combination of IP spoofing and TCP sequence prediction to compromise computer security researcher Tsutomu Shimomura’s system (`x-terminal`).
* **Attack Mechanism:** Mitnick launched a SYN flood against the trusted host (`server-a`) to silence it. He then generated TCP SYN requests to Shimomura's `x-terminal`, spoofing the source address as `server-a`. By accurately predicting the initial sequence numbers (ISNs) generated by the target OS, Mitnick established an unauthenticated `rlogin` session without seeing the server's SYN-ACK responses.
* **Outcome:** Mitnick gained root access to the target host, stealing administrative tools and source code. The incident highlighted critical design vulnerabilities in legacy TCP/IP implementations and `rsh`/`rlogin` trust relationships.

### 4.3 Organizational Impact
* **Bypassing Access Control Lists (ACLs)**: Circumventing IP-restricted firewall rules and IP-whitelisted database connections.
* **Facilitating Reflection DDoS Attacks**: Spoofing victim target IPs in UDP requests to direct massive amplification flows to the target.
* **Session Hijacking & Privilege Escalation**: Impersonating trusted internal hosts to execute remote commands without credential challenge.

### 4.4 Specific Mitigation Strategies
1. **Implementation of BCP 38 / Network Ingress & Egress Filtering**: Configure edge routers and firewalls with **Best Current Practice 38 (BCP 38 / RFC 2827)** rules to block packets leaving a network whose source IP does not belong to the internal network range, and block inbound packets arriving with internal source IPs.
2. **Cryptographic Header Verification via IPsec**: Utilize **IPsec (Internet Protocol Security)** operating in Authentication Header (AH) or Encapsulating Security Payload (ESP) mode to verify sender identity via cryptographic signatures on every packet.
3. **Disabling IP Source Routing & Using Random Initial Sequence Numbers (ISNs)**: Disable IP source routing options across operating systems and network devices, and ensure modern operating systems enforce cryptographically secure pseudo-random number generators (PRNG) for TCP ISN generation.

---

## 5. DNS Poisoning / DNS Spoofing (Bonus 4th Threat)

### 5.1 Technical Explanation & Mechanics
**DNS Poisoning (also known as DNS Cache Poisoning)** is an attack where corrupted Domain Name System (DNS) data is injected into a recursive DNS resolver’s cache. Once the cache is poisoned, the resolver returns an incorrect IP address (controlled by the attacker) for a legitimate domain name, causing user traffic to be transparently redirected to a malicious destination server without the user's knowledge.

DNS relies on 16-bit Transaction IDs (TXIDs) and UDP port numbers to validate DNS query responses. If an attacker can guess or predict the matching TXID and query port before the legitimate authoritative DNS server replies, the resolver accepts the fake response and caches it for the duration specified by the Time-To-Live (TTL) value.

```
[Client Query: bank.com] ──► [DNS Resolver Cache (POISONED!)] ──► [Returns Attacker IP: 198.51.100.44]
                                                                        │
                                                                        ▼
                                                             [Attacker Phishing Site]
```

### 5.2 Documented Real-World Case Study
* **Incident:** *The 2008 Dan Kaminsky DNS Vulnerability Discovery & 2014 Malaysia Airlines DNS Hijack*
* **Context:** In 2008, security researcher Dan Kaminsky discovered a fundamental flaw in the DNS protocol specification that allowed attackers to poison any DNS cache within seconds by generating queries for non-existent subdomains (`1.google.com`, `2.google.com`) and spamming spoofed responses.
* **Real-World Incident:** In August 2014, hacktivist group "Lizard Squad" executed a DNS cache poisoning attack against Malaysia Airlines (`malaysiaairlines.com`), altering the domain's DNS records to point to a hacker defacement server.
* **Outcome:** Users visiting the official airline website were redirected to a defaced landing page displaying a cyber-group banner. The attack demonstrated how DNS cache poisoning can disrupt enterprise operations without modifying files on the target web server itself.

### 5.3 Organizational Impact
* **Mass Phishing & Credential Harvester Redirection**: Directing unsuspecting users to pixel-perfect fraudulent banking or corporate login portals.
* **Malware Distribution**: Silently routing automated software updates to malicious servers containing trojanized binaries.
* **Email & Infrastructure Hijacking**: Intercepting inbound SMTP emails by poisoning MX (Mail Exchange) DNS records.

### 5.4 Specific Mitigation Strategies
1. **Deployment of DNSSEC (DNS Security Extensions)**: Implement **DNSSEC**, which uses digital signatures based on public key cryptography to authenticate the origin and verify the integrity of DNS response data, preventing cache insertion of unverified records.
2. **DNS Source Port Randomization (SPRs)**: Upgrade all internal and public recursive DNS resolvers to versions supporting random UDP source port selection across a range of ~60,000 ports alongside 16-bit Transaction IDs, increasing the attacker's brute-force search space to over 4 billion possibilities (`2^16 * 60,000`).
3. **Use of Secure, Monitored DNS Resolvers & DNS Over HTTPS (DoH)**: Route enterprise DNS queries through enterprise-grade DNS resolvers enforcing DNSSEC validation, filtering, and encrypted DNS transport protocols like **DNS over HTTPS (DoH)** or **DNS over TLS (DoT)**.

---

## 6. Threat Comparison & Evaluation Matrix

| Threat Vector | Primary Attack Mechanism | Who is Most at Risk? | Execution Difficulty | Ease of Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **DoS / DDoS** | Volumetric flooding & protocol state exhaustion via botnets | Public web services, e-commerce, cloud platforms | 🟢 **Low to Medium** (Rentable DDoS-for-hire services) | 🟡 **Medium** (Requires dedicated scrubbing CDN infrastructure) |
| **Man-in-the-Middle (MITM)** | Traffic interception via ARP poisoning, Rogue APs, or SSL stripping | Public Wi-Fi users, unencrypted local networks | 🟡 **Medium** (Requires local network positioning or CA compromise) | 🟢 **High Ease** (Enforce HTTPS, HSTS, E2EE, and mTLS) |
| **IP Spoofing** | Packet header source address manipulation | Systems relying on IP-based trust ACLs | 🔴 **High** (Blocked by modern ISP egress filtering; requires sequence prediction) | 🟢 **High Ease** (Deploy BCP 38 filtering & cryptographic IPsec) |
| **DNS Poisoning** | Injecting forged DNS response packets into resolver caches | Recursive DNS servers, corporate endpoints using plain DNS | 🔴 **High** (Post-Kaminsky port randomization requires precise timing) | 🟡 **Medium** (Requires global DNSSEC adoption and resolver upgrades) |

---

## 7. Conclusion & Administrator Key Takeaways

Network security threats continue to evolve from simple disruptive acts into highly coordinated, financially motivated, and nation-state targeted campaigns. Protecting modern enterprise networks requires moving beyond static perimeter defenses toward a defense-in-depth security model.

### 💡 3 Key Takeaways for Network Administrators:
1. **Zero Trust Architecture (ZTA) & Mandatory Encryption**: Never rely on network-level IP address whitelisting or unencrypted local subnets. Enforce strong cryptographic protocols (TLS 1.3, SSH, IPsec) and mutual authentication across all data paths.
2. **Adhere to Edge Filtering Best Practices (BCP 38 & DNSSEC)**: Proactively eliminate network vectors that enable spoofing and reflection by implementing BCP 38 ingress/egress filtering and enabling DNSSEC on all corporate domains and recursive resolvers.
3. **Deploy Hybrid Cloud DDoS Scrubbing & Rate Limiting**: Ensure high-availability web applications are protected behind Anycast cloud mitigation networks capable of absorbing multi-terabit volumetric floods before traffic reaches internal infrastructure.

---

## 8. References & Credible Sources

1. **NIST (National Institute of Standards and Technology)**: *Guide to Intrusion Detection and Prevention Systems (IDPS)*, NIST Special Publication 800-94. Available at: [https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-94.pdf](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-94.pdf)
2. **CISA (Cybersecurity and Infrastructure Security Agency)**: *Understanding and Mitigating Layer 7 DDoS Attacks*. Available at: [https://www.cisa.gov/news-events/news/understanding-and-mitigating-ddos-attacks](https://www.cisa.gov/news-events/news/understanding-and-mitigating-ddos-attacks)
3. **MITRE ATT&CK Framework**: *Technique T1498: Network Denial of Service & Technique T1557: Man-in-the-Middle*. Available at: [https://attack.mitre.org/](https://attack.mitre.org/)
4. **Internet Engineering Task Force (IETF)**: *Ingress Filtering for Multihomed Networks (BCP 38 / RFC 2827)*. Available at: [https://datatracker.ietf.org/doc/html/rfc2827](https://datatracker.ietf.org/doc/html/rfc2827)
5. **SANS Institute Reading Room**: *DNS Cache Poisoning Mechanics and Protection Strategies*. Available at: [https://www.sans.org/white-papers/](https://www.sans.org/white-papers/)
