
package com.smartruralclinic.backend.service;

import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class SentimentAnalysisService {

    private final Set<String> positiveWords = Set.of(
            "good", "great", "excellent", "friendly",
            "helpful", "happy", "quick", "clean",
            "professional", "wonderful", "better",
            "improved", "satisfied", "kind", "efficient",
            "thank", "love", "comfortable"
    );

    private final Set<String> negativeWords = Set.of(
            "bad", "poor", "terrible", "rude",
            "slow", "unhappy", "dirty", "late",
            "unhelpful", "disappointed", "long",
            "worse", "worst", "painful", "unprofessional",
            "delayed", "problem", "difficult"
    );

    public String analyseSentiment(String comments) {

        String[] words = comments.toLowerCase()
                .replaceAll("[^a-z\\s]", "")
                .split("\\s+");

        int positiveCount = 0;
        int negativeCount = 0;

        for (String word : words) {
            if (positiveWords.contains(word)) {
                positiveCount++;
            }

            if (negativeWords.contains(word)) {
                negativeCount++;
            }
        }

        if (positiveCount > negativeCount) {
            return "POSITIVE";
        }

        if (negativeCount > positiveCount) {
            return "NEGATIVE";
        }

        return "NEUTRAL";
    }

    public double calculateSentimentScore(String comments) {

        String sentiment = analyseSentiment(comments);

        return switch (sentiment) {
            case "POSITIVE" -> 0.90;
            case "NEGATIVE" -> 0.10;
            default -> 0.50;
        };
    }
}
