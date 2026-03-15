package com.org.Triplens.Services.Flight;

import org.springframework.stereotype.Service;

import com.org.Triplens.entity.Airport;
import com.org.Triplens.exception.FlightException.CityNotFoundException;
import com.org.Triplens.repository.airportrepository.AirportRepository;

@Service
public class AirportResolverService {

    private final AirportRepository airportRepository;
    private static final java.util.Map<String, String> FALLBACK_IATA_MAP = new java.util.HashMap<>();

    static {
        FALLBACK_IATA_MAP.put("new delhi", "DEL");
        FALLBACK_IATA_MAP.put("delhi", "DEL");
        FALLBACK_IATA_MAP.put("mumbai", "BOM");
        FALLBACK_IATA_MAP.put("bangalore", "BLR");
        FALLBACK_IATA_MAP.put("bengaluru", "BLR");
        FALLBACK_IATA_MAP.put("chennai", "MAA");
        FALLBACK_IATA_MAP.put("kolkata", "CCU");
        FALLBACK_IATA_MAP.put("hyderabad", "HYD");
        FALLBACK_IATA_MAP.put("pune", "PNQ");
        FALLBACK_IATA_MAP.put("jaipur", "JAI");
        FALLBACK_IATA_MAP.put("goa", "GOI");
        FALLBACK_IATA_MAP.put("ahmedabad", "AMD");
        FALLBACK_IATA_MAP.put("kochi", "COK");
    }

    public AirportResolverService(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    public String resolveCityToIata(String cityName) {
        String normalizedCity = cityName.trim().toLowerCase();

        return airportRepository
                .findByCityNameIgnoreCase(cityName.trim())
                .map(Airport::getIataCode)
                .orElseGet(() -> {
                    // Try fallback map
                    if (FALLBACK_IATA_MAP.containsKey(normalizedCity)) {
                        return FALLBACK_IATA_MAP.get(normalizedCity);
                    }
                    throw new CityNotFoundException(cityName);
                });
    }
}
