/******************************************************************************
 *
 * Rating.java
 *
 * author: Ian laird
 *
 * Created 2/25/20
 *
 * © 2020
 *
 ******************************************************************************/

package edu.baylor.ecs.athleticstorm.model.rating;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "RATING")
@Data
@AllArgsConstructor
public class Rating {

    @EmbeddedId
    private RatingKey key;

    @Column(name = "RATING")
    private Double rating;

    @Enumerated(EnumType.STRING)
    private PersonType type;
}
